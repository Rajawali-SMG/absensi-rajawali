import { TRPCError } from "@trpc/server";
import { count, eq, ilike } from "drizzle-orm";
import z from "zod";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import { idBase } from "@/types";
import { desaCreateSchema, desaFilter, desaUpdateSchema } from "@/types/desa";
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

	getOneDesa: publicProcedure.input(idBase).query(async ({ ctx, input }) => {
		const data = await ctx.db.query.desa.findFirst({
			where: eq(desa.id, Number(input.id)),
		});

		if (!data) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Data Desa tidak ditemukan",
			});
		}

		return formatResponse(true, "Berhasil mendapatkan data Desa", data, null);
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
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}

			const data = await ctx.db
				.update(desa)
				.set(input)
				.where(eq(desa.id, input.id));

			return formatResponse(true, "Berhasil mengubah data Desa", data, null);
		}),

	deleteDesa: publicProcedure
		.input(
			z.object({
				id: z
					.int()
					.min(1, "ID tidak boleh kosong")
					.max(32767, "ID maksimal 32767"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.delete(desa).where(eq(desa.id, input.id));

			return formatResponse(true, "Berhasil menghapus data Desa", data, null);
		}),
});
