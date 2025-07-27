import { TRPCError } from "@trpc/server";
import { hash } from "argon2";
import { count, eq, ilike, or } from "drizzle-orm";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	userCreateSchema,
	userDeleteSchema,
	userFilter,
	userUpdateSchema,
} from "@/types/user";
import { idBase } from "../../../types/api";
import { user } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.user.findMany({
			columns: {
				password: false,
			},
		});

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data User",
			{
				items: data,
				meta: {
					limit: data.length,
					page: 1,
					total: data.length,
					totalPages: 1,
				},
			},
			null,
		);
	}),

	getAllPaginated: publicProcedure
		.input(userFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.user.findMany({
				columns: {
					password: false,
				},
				limit,
				offset: page * limit,
				where: or(
					input.role ? eq(user.role, input.role) : undefined,
					input.q ? ilike(user.username, `%${input.q}%`) : undefined,
				),
			});

			const [total] = await ctx.db.select({ count: count() }).from(user);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data User",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
				null,
			);
		}),

	getOneUser: publicProcedure.input(idBase).query(async ({ ctx, input }) => {
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
			const data = await ctx.db.insert(user).values({
				...input,
				password: await hash(input.password),
			});

			return formatResponse(true, "Berhasil menambahkan data User", data, null);
		}),

	updateUser: publicProcedure
		.input(userUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db
				.update(user)
				.set(input)
				.where(eq(user.id, input.id));

			return formatResponse(true, "Berhasil mengubah data User", data, null);
		}),

	deleteUser: publicProcedure
		.input(userDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.delete(user).where(eq(user.id, input.id));

			return formatResponse(true, "Berhasil menghapus data User", data, null);
		}),
});
