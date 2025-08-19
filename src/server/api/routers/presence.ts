import { TRPCError } from "@trpc/server";
import { and, count, eq, or } from "drizzle-orm";
import z from "zod";
import {
	formatResponse,
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { idBase } from "@/types";
import {
	presenceCreateSchema,
	presenceFilter,
	presenceUpdateSchema,
} from "@/types/presence";
import { generus, presence } from "../../db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const presenceRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.presence.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Presensi",
			data,
			null,
		);
	}),

	getAllPaginated: protectedProcedure
		.input(presenceFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.presence.findMany({
				limit,
				offset: page * limit,
			});

			const [total] = await ctx.db.select({ count: count() }).from(presence);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data Presensi",
				{
					items: data,
					meta: {
						total: totalCount,
						page,
						limit,
						totalPages,
					},
				},
				null,
			);
		}),

	getOnePresence: protectedProcedure
		.input(idBase)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.presence.findFirst({
				where: eq(presence.id, input.id),
			});

			if (!data) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Data Presensi tidak ditemukan",
				});
			}

			return formatResponse(
				true,
				"Berhasil mendapatkan data Presensi",
				data,
				null,
			);
		}),

	createPresence: publicProcedure
		.input(presenceCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingPresence = await ctx.db.query.presence.findFirst({
				where: and(
					eq(presence.generusId, input.generusId),
					eq(presence.eventId, input.eventId),
				),
			});

			if (existingPresence) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Data Presensi sudah ada",
				});
			}

			const data = await ctx.db.insert(presence).values(input);

			return formatResponse(
				true,
				"Berhasil menambahkan data Presensi",
				data,
				null,
			);
		}),

	updatePresence: protectedProcedure
		.input(presenceUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}

			const data = await ctx.db
				.update(presence)
				.set(input)
				.where(eq(presence.id, input.id));

			return formatResponse(
				true,
				"Berhasil mengubah data Presensi",
				data,
				null,
			);
		}),

	deletePresence: protectedProcedure
		.input(idBase)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db
				.delete(presence)
				.where(eq(presence.id, input.id));

			return formatResponse(
				true,
				"Berhasil menghapus data Presensi",
				data,
				null,
			);
		}),

	exportPresence: publicProcedure
		.input(z.object({ eventId: z.string(), kelompokId: z.string() }))
		.query(async ({ ctx, input }) => {
			const data = await ctx.db
				.select({
					generusId: presence.generusId,
					generusName: generus.nama,
					status: presence.status,
				})
				.from(presence)
				.innerJoin(generus, eq(presence.generusId, generus.id))
				.where(
					or(
						eq(presence.eventId, input.eventId),
						eq(generus.kelompokId, input.kelompokId),
					),
				);

			if (!data) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Data Presensi tidak ditemukan",
				});
			}

			return formatResponse(
				true,
				"Berhasil mendapatkan data Presensi",
				data,
				null,
			);
		}),
});
