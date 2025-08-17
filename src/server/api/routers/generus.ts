import { TRPCError } from "@trpc/server";
import { and, count, eq, ilike } from "drizzle-orm";
import z from "zod";
import {
	formatResponse,
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { idBase } from "@/types";
import {
	generusCreateSchema,
	generusFilter,
	generusUpdateSchema,
} from "@/types/generus";
import { generus, kelompok, presence } from "../../db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const generusRouter = createTRPCRouter({
	getAll: protectedProcedure
		.input(generusFilter.omit({ q: true, page: true, limit: true }))
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.generus.findMany({
				where: and(
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
					input.kelompokId
						? eq(generus.kelompokId, input.kelompokId)
						: undefined,
				),
			});

			return formatResponseArray(
				true,
				"Berhasil mendapatkan semua data Generus",
				data,
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
				orderBy: (generus, { desc }) => [desc(generus.createdAt)],
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

			return formatResponsePagination(
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

	getEventAttendancebyGenerus: protectedProcedure
		.input(idBase)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.presence.findMany({
				where: eq(presence.generusId, input.id),
			});

			return formatResponse(
				true,
				"Berhasil mendapatkan data Presensi",
				data,
				null,
			);
		}),

	withKelompok: publicProcedure.input(idBase).query(async ({ ctx, input }) => {
		const data = await ctx.db
			.select({
				generusId: generus.id,
				generusName: generus.nama,
				kelompokId: kelompok.id,
				kelompokName: kelompok.nama,
			})
			.from(generus)
			.innerJoin(kelompok, eq(generus.kelompokId, kelompok.id));

		const dataWithAttendance = await Promise.all(
			data.map(async (gen) => {
				const attendanceRecord = await ctx.db
					.select()
					.from(presence)
					.where(
						and(
							eq(presence.generusId, gen.generusId),
							eq(presence.eventId, input.id),
						),
					)
					.then((rows) => rows[0]);

				return {
					...gen,
					isDisabled: !!attendanceRecord,
					status: attendanceRecord?.status || null,
				};
			}),
		);

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Presensi",
			dataWithAttendance,
			null,
		);
	}),

	uploadGenerus: protectedProcedure
		.input(z.array(generusCreateSchema))
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.insert(generus).values(input);

			return formatResponse(
				true,
				"Berhasil menambahkan data Generus",
				data,
				null,
			);
		}),
});
