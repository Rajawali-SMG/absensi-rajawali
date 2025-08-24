import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { and, count, eq, ilike } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import {
	formatResponse,
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { idBase } from "@/types";
import {
	userCreateSchema,
	userFilter,
	userUpdatePasswordSchema,
	userUpdateSchema,
} from "@/types/user";
import { account, log, session, user } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	createUser: protectedProcedure
		.input(userCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const hashPassword = await hash(input.password);
			const userId = uuid();
			const existingUser = await ctx.db
				.select()
				.from(user)
				.where(eq(user.email, input.email));

			if (existingUser.length > 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Email ${input.email} sudah terdaftar`,
				});
			}

			const data = await ctx.db.insert(user).values({
				id: userId,
				...input,
				role: "Admin",
			});

			await ctx.db.insert(account).values({
				accountId: userId,
				password: hashPassword,
				providerId: "credential",
				userId,
			});

			await ctx.db.insert(log).values({
				description: `Menambahkan Data User: ${input.email}`,
				event: "Create",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				`Berhasil menambahkan User: ${input.email}`,
				data,
				null,
			);
		}),

	deleteUser: protectedProcedure
		.input(idBase)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(account).where(eq(account.userId, input.id));
			await ctx.db.delete(session).where(eq(session.userId, input.id));
			const userData = await ctx.db.delete(user).where(eq(user.id, input.id));

			await ctx.db.insert(log).values({
				description: `Menghapus Data User: ${input.id}`,
				event: "Delete",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				"Berhasil menghapus data User",
				userData,
				null,
			);
		}),
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.user.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data User",
			data,
			null,
		);
	}),

	getAllPaginated: protectedProcedure
		.input(userFilter)
		.query(async ({ ctx, input }) => {
			const whereFilter = and(
				input.q ? ilike(user.name, `%${input.q}%`) : undefined,
			);

			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.user.findMany({
				limit,
				offset: page * limit,
				orderBy: (user, { desc }) => [desc(user.updatedAt)],
				where: whereFilter,
			});

			const [total] = await ctx.db
				.select({ count: count() })
				.from(user)
				.where(whereFilter);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data User",
				{ items: data, meta: { limit, page, total: totalCount, totalPages } },
				null,
			);
		}),

	getOneUser: protectedProcedure.input(idBase).query(async ({ ctx, input }) => {
		const data = await ctx.db.query.user.findFirst({
			where: eq(user.id, input.id),
		});

		if (!data) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Data User tidak ditemukan",
			});
		}

		return formatResponse(true, "Berhasil mendapatkan data User", data, null);
	}),

	getProfile: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.user.findFirst({
			where: eq(user.id, ctx.session.user.id),
		});

		return formatResponse(true, "Berhasil mendapatkan data User", data, null);
	}),

	updatePasswordUser: protectedProcedure
		.input(userUpdatePasswordSchema)
		.mutation(async ({ ctx, input }) => {
			const hashPassword = await hash(input.password);
			const data = await ctx.db
				.update(account)
				.set({
					password: hashPassword,
				})
				.where(eq(account.userId, input.id));

			await ctx.db.insert(log).values({
				description: `Mengubah Password User: ${input.id}`,
				event: "Update",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				"Berhasil mengupdate password User",
				data,
				null,
			);
		}),

	updateUser: protectedProcedure
		.input(userUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingUser = await ctx.db
				.select()
				.from(user)
				.where(eq(user.email, input.email));

			if (existingUser) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Email ${input.email} sudah terdaftar`,
				});
			}

			const data = await ctx.db
				.update(user)
				.set({
					email: input.email,
					name: input.name,
				})
				.where(eq(user.id, input.id));

			await ctx.db.insert(log).values({
				description: `Mengubah Data User: ${input.email}`,
				event: "Update",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				`Berhasil mengupdate User: ${input.email}`,
				data,
				null,
			);
		}),
});
