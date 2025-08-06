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
import { account, session, user } from "../../db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
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
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.user.findMany({
				limit,
				offset: page * limit,
				where: and(input.q ? ilike(user.name, `%${input.q}%`) : undefined),
			});

			const [total] = await ctx.db.select({ count: count() }).from(user);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data User",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
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

	createUser: publicProcedure
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
					message: "Email sudah terdaftar",
				});
			}

			const data = await ctx.db.insert(user).values({
				id: userId,
				...input,
				role: "Admin",
			});

			await ctx.db.insert(account).values({
				accountId: userId,
				providerId: "credential",
				userId,
				password: hashPassword,
			});

			return formatResponse(true, "Berhasil menambahkan data User", data, null);
		}),

	updateUser: protectedProcedure
		.input(userUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingUser = await ctx.db
				.select()
				.from(user)
				.where(eq(user.email, input.email));

			if (existingUser.length > 0) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Email sudah terdaftar",
				});
			}

			const data = await ctx.db
				.update(user)
				.set({
					name: input.name,
					email: input.email,
				})
				.where(eq(user.id, input.id));

			return formatResponse(true, "Berhasil mengupdate data User", data, null);
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

			return formatResponse(
				true,
				"Berhasil mengupdate password User",
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

			return formatResponse(
				true,
				"Berhasil menghapus data User",
				userData,
				null,
			);
		}),
});
