import { TRPCError } from "@trpc/server";
import { and, count, eq, ilike, ne } from "drizzle-orm";
import {
	formatResponse,
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { idBase } from "@/types";
import { desaCreateSchema, desaFilter, desaUpdateSchema } from "@/types/desa";
import { desa, kelompok, log } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const desaRouter = createTRPCRouter({
	createDesa: protectedProcedure
		.input(desaCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingDesa = await ctx.db.query.desa.findFirst({
				where: eq(desa.nama, input.nama),
			});
			if (existingDesa) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Data Desa sudah ada",
				});
			}

			const data = await ctx.db.insert(desa).values(input);

			await ctx.db.insert(log).values({
				description: `Menambahkan Data Desa: ${input.nama}`,
				event: "Create",
				userId: ctx.session.user.email,
			});

			return formatResponse(true, "Berhasil menambahkan data Desa", data, null);
		}),

	deleteDesa: protectedProcedure
		.input(idBase)
		.mutation(async ({ ctx, input }) => {
			const relatedKelompok = await ctx.db.query.kelompok.findFirst({
				where: eq(kelompok.desaId, input.id),
			});

			if (relatedKelompok) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Data Kelompok terkait ditemukan",
				});
			}

			const data = await ctx.db.delete(desa).where(eq(desa.id, input.id));

			await ctx.db.insert(log).values({
				description: `Menghapus Data Desa: ${input.id}`,
				event: "Delete",
				userId: ctx.session.user.email,
			});

			return formatResponse(true, "Berhasil menghapus data Desa", data, null);
		}),
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.desa.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Desa",
			data,
			null,
		);
	}),

	getAllPaginated: protectedProcedure
		.input(desaFilter)
		.query(async ({ ctx, input }) => {
			const whereFilter = ilike(desa.nama, `%${input.q}%`);

			const limit = input.limit ?? 9;
			const page = input.page ?? 0;

			const data = await ctx.db.query.desa.findMany({
				limit,
				offset: page * limit,
				orderBy: (desa, { desc }) => [desc(desa.updatedAt)],
				where: whereFilter,
			});

			const [total] = await ctx.db
				.select({ count: count() })
				.from(desa)
				.where(whereFilter);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data Desa",
				{
					items: data,
					meta: { limit, page, total: totalCount, totalPages },
				},
				null,
			);
		}),

	getOneDesa: protectedProcedure.input(idBase).query(async ({ ctx, input }) => {
		const data = await ctx.db.query.desa.findFirst({
			where: eq(desa.id, input.id),
		});

		if (!data) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Data Desa tidak ditemukan",
			});
		}

		return formatResponse(true, "Berhasil mendapatkan data Desa", data, null);
	}),

	updateDesa: protectedProcedure
		.input(desaUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingDesa = await ctx.db.query.desa.findFirst({
				where: and(eq(desa.nama, input.nama), ne(desa.id, input.id)),
			});
			if (existingDesa) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Data Desa sudah ada",
				});
			}

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

			await ctx.db.insert(log).values({
				description: `Mengubah Data Desa: ${input.nama}`,
				event: "Update",
				userId: ctx.session.user.email,
			});

			return formatResponse(true, "Berhasil mengubah data Desa", data, null);
		}),
});
