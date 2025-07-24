import { count, eq, ilike, or } from "drizzle-orm";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	generusCreateSchema,
	generusDeleteSchema,
	generusFilter,
	generusUpdateSchema,
} from "@/types/generus";
import { generus } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const generusRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.generus.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Generus",
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
		.input(generusFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.generus.findMany({
				limit,
				offset: page * limit,
				where: or(
					input.q ? ilike(generus.nama, `%${input.q}%`) : undefined,
					input.jenis_kelamin
						? eq(generus.jenis_kelamin, input.jenis_kelamin)
						: undefined,
					input.jenjang ? eq(generus.jenjang, input.jenjang) : undefined,
					input.pendidikan_terakhir
						? eq(generus.pendidikan_terakhir, input.pendidikan_terakhir)
						: undefined,
					input.sambung ? eq(generus.sambung, input.sambung) : undefined,
					input.keterangan
						? eq(generus.keterangan, input.keterangan)
						: undefined,
				),
			});

			const [total] = await ctx.db.select({ count: count() }).from(generus);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Generus",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
				null,
			);
		}),

	createGenerus: publicProcedure
		.input(generusCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.insert(generus).values(input);

			return formatResponse(
				true,
				"Berhasil menambahkan data Generus",
				data,
				null,
			);
		}),

	updateGenerus: publicProcedure
		.input(generusUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db
				.update(generus)
				.set(input)
				.where(eq(generus.id, input.id));

			return formatResponse(true, "Berhasil mengubah data Generus", data, null);
		}),

	deleteGenerus: publicProcedure
		.input(generusDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.delete(generus).where(eq(generus.id, input.id));

			return formatResponse(
				true,
				"Berhasil menghapus data Generus",
				data,
				null,
			);
		}),
});
