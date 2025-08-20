import { TRPCError } from "@trpc/server";
import { and, count, eq, ilike, ne, or } from "drizzle-orm";
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
import { generus, kelompok, log } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const kelompokRouter = createTRPCRouter({
	createKelompok: protectedProcedure
		.input(kelompokCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingKelompok = await ctx.db.query.kelompok.findFirst({
				where: eq(kelompok.nama, input.nama),
			});

			if (existingKelompok) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Nama sudah didaftarkan, silahkan gunakan nama lain",
				});
			}
			const data = await ctx.db.insert(kelompok).values(input);

			await ctx.db.insert(log).values({
				description: `Menambahkan Data Kelompok: ${input.nama}`,
				event: "Create",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				"Berhasil menambahkan data Kelompok",
				data,
				null,
			);
		}),

	deleteKelompok: protectedProcedure
		.input(idBase)
		.mutation(async ({ ctx, input }) => {
			const relatedGenerus = await ctx.db.query.generus.findFirst({
				where: eq(generus.kelompokId, input.id),
			});

			if (relatedGenerus) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Data Generus terkait ditemukan",
				});
			}

			const data = await ctx.db
				.delete(kelompok)
				.where(eq(kelompok.id, input.id));

			await ctx.db.insert(log).values({
				description: `Menghapus Data Kelompok: ${input.id}`,
				event: "Delete",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				"Berhasil menghapus data Kelompok",
				data,
				null,
			);
		}),

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
			const whereFilter = and(
				input.q ? ilike(kelompok.nama, `%${input.q}%`) : undefined,
				input.desaId ? eq(kelompok.desaId, input.desaId) : undefined,
			);

			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.kelompok.findMany({
				limit,
				offset: page * limit,
				orderBy: (kelompok, { desc }) => [desc(kelompok.updatedAt)],
				where: whereFilter,
			});

			const [total] = await ctx.db
				.select({ count: count() })
				.from(kelompok)
				.where(whereFilter);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data Kelompok",
				{ items: data, meta: { limit, page, total: totalCount, totalPages } },
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

	updateKelompok: protectedProcedure
		.input(kelompokUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingKelompok = await ctx.db.query.kelompok.findFirst({
				where: and(
					or(eq(kelompok.nama, input.nama), eq(kelompok.code, input.code)),
					ne(kelompok.id, input.id),
				),
			});
			if (existingKelompok) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Data Kelompok sudah ada",
				});
			}

			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}
			const data = await ctx.db
				.update(kelompok)
				.set(input)
				.where(eq(kelompok.id, input.id))
				.returning();

			await ctx.db.insert(log).values({
				description: `Mengubah Data Kelompok: ${input.nama}`,
				event: "Update",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				"Berhasil mengubah data Kelompok",
				data,
				null,
			);
		}),
});
