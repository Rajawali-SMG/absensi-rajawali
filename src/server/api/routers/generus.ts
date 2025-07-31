import { TRPCError } from "@trpc/server";
import { and, count, eq, ilike } from "drizzle-orm";
import { utils, write } from "xlsx";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import { idBase } from "@/types";
import {
	generusCreateSchema,
	generusFilter,
	generusUpdateSchema,
} from "@/types/generus";
import { generus } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const generusRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
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

	getAllPaginated: protectedProcedure
		.input(generusFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.generus.findMany({
				limit,
				offset: page * limit,
				where: and(
					ilike(generus.nama, `%${input.q}%`),
					input.jenisKelamin
						? eq(generus.jenisKelamin, input.jenisKelamin)
						: undefined,
					input.jenjang ? eq(generus.jenjang, input.jenjang) : undefined,
					input.pendidikanTerakhir
						? eq(generus.pendidikanTerakhir, input.pendidikanTerakhir)
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

	getOneGenerus: protectedProcedure
		.input(idBase)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.generus.findFirst({
				where: eq(generus.id, input.id),
			});

			if (!data) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Data Generus tidak ditemukan",
				});
			}

			return formatResponse(
				true,
				"Berhasil mendapatkan data Generus",
				data,
				null,
			);
		}),

	createGenerus: protectedProcedure
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

	updateGenerus: protectedProcedure
		.input(generusUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}
			const data = await ctx.db
				.update(generus)
				.set(input)
				.where(eq(generus.id, input.id));

			return formatResponse(true, "Berhasil mengubah data Generus", data, null);
		}),

	deleteGenerus: protectedProcedure
		.input(idBase)
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
