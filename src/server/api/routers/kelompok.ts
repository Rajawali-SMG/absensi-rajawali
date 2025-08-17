import { TRPCError } from "@trpc/server";
import { and, count, eq, ilike } from "drizzle-orm";
import {
	formatResponse,
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { idBase } from "@/types";
import {
	kelompokCreateSchema,
	kelompokFilter,
	kelompokUpdateSchema,
} from "@/types/kelompok";
import { kelompok } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const kelompokRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.kelompok.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Kelompok",
			data,
			null,
		);
	}),

	getAllPaginated: protectedProcedure
		.input(kelompokFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.kelompok.findMany({
				limit,
				offset: page * limit,
				where: and(
					input.q ? ilike(kelompok.nama, `%${input.q}%`) : undefined,
					input.desaId ? eq(kelompok.desaId, input.desaId) : undefined,
				),
			});

			const [total] = await ctx.db.select({ count: count() }).from(kelompok);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data Kelompok",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
				null,
			);
		}),

	getOneKelompok: protectedProcedure
		.input(idBase)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.kelompok.findFirst({
				where: eq(kelompok.id, input.id),
			});

			if (!data) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Data Kelompok tidak ditemukan",
				});
			}

			return formatResponse(
				true,
				"Berhasil mendapatkan data Kelompok",
				data,
				null,
			);
		}),

	createKelompok: protectedProcedure
		.input(kelompokCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingKelompok = await ctx.db.query.kelompok.findFirst({
				where: and(eq(kelompok.code, input.code)),
			});

			if (existingKelompok) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Code sudah didaftarkan, silahkan gunakan kode lain",
				});
			}
			const data = await ctx.db.insert(kelompok).values(input);

			return formatResponse(
				true,
				"Berhasil menambahkan data Kelompok",
				data,
				null,
			);
		}),

	updateKelompok: protectedProcedure
		.input(kelompokUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}
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

	deleteKelompok: protectedProcedure
		.input(idBase)
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
