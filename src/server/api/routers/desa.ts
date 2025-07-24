import { count, eq, ilike } from "drizzle-orm";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	desaCreateSchema,
	desaDeleteSchema,
	desaFilter,
	desaUpdateSchema,
} from "@/types/desa";
import { desa } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const desaRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.desa.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Desa",
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
		.input(desaFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.desa.findMany({
				limit,
				offset: page * limit,
				where: ilike(desa.nama, `%${input.q}%`),
			});

			const [total] = await ctx.db.select({ count: count() }).from(desa);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Desa",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
				null,
			);
		}),

	createDesa: publicProcedure
		.input(desaCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.insert(desa).values(input);

			return formatResponse(true, "Berhasil menambahkan data Desa", data, null);
		}),

	updateDesa: publicProcedure
		.input(desaUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db
				.update(desa)
				.set(input)
				.where(eq(desa.id, input.id));

			return formatResponse(true, "Berhasil mengubah data Desa", data, null);
		}),

	deleteDesa: publicProcedure
		.input(desaDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.delete(desa).where(eq(desa.id, input.id));

			return formatResponse(true, "Berhasil menghapus data Desa", data, null);
		}),
});
