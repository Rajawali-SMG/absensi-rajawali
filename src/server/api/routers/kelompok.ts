import { count, eq, ilike, or } from "drizzle-orm";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	kelompokCreateSchema,
	kelompokDeleteSchema,
	kelompokFilter,
	kelompokUpdateSchema,
} from "@/types/kelompok";
import { kelompok } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const kelompokRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.kelompok.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Kelompok",
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
		.input(kelompokFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.kelompok.findMany({
				limit,
				offset: page * limit,
				where: or(
					input.q ? ilike(kelompok.nama, `%${input.q}%`) : undefined,
					input.desa_id ? eq(kelompok.desa_id, input.desa_id) : undefined,
				),
			});

			const [total] = await ctx.db.select({ count: count() }).from(kelompok);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Kelompok",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
				null,
			);
		}),

	createKelompok: publicProcedure
		.input(kelompokCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.insert(kelompok).values(input);

			return formatResponse(
				true,
				"Berhasil menambahkan data Kelompok",
				data,
				null,
			);
		}),

	updateKelompok: publicProcedure
		.input(kelompokUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db
				.update(kelompok)
				.set(input)
				.where(eq(kelompok.id, input.id));

			return formatResponse(
				true,
				"Berhasil mengubah data Kelompok",
				data,
				null,
			);
		}),

	deleteKelompok: publicProcedure
		.input(kelompokDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db
				.delete(kelompok)
				.where(eq(kelompok.id, input.id));

			return formatResponse(
				true,
				"Berhasil menghapus data Kelompok",
				data,
				null,
			);
		}),
});
