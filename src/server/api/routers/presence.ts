import { TRPCError } from "@trpc/server";
import { and, count, eq, or } from "drizzle-orm";
import z from "zod";
import {
	formatResponse,
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { idBase } from "@/types";
import { presenceCreateSchema, presenceFilter } from "@/types/presence";
import { generus, presence } from "../../db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const presenceRouter = createTRPCRouter({
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

			const generusData = await ctx.db.query.generus.findFirst({
				where: eq(generus.id, input.generusId),
			});

			if (!generusData) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Data Generus tidak ditemukan",
				});
			}

			const data = await ctx.db.insert(presence).values({
				...input,
				generusName: generusData.nama,
			});

			return formatResponse(
				true,
				"Berhasil menambahkan data Presensi",
				data,
				null,
			);
		}),

	exportPresence: publicProcedure
		.input(z.object({ eventId: z.string(), kelompokId: z.string() }))
		.query(async ({ ctx, input }) => {
			const data = await ctx.db
				.select({
					generusName: presence.generusName,
					status: presence.status,
				})
				.from(presence)
				.leftJoin(generus, eq(presence.generusId, generus.id))
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

			const [hadir] = await ctx.db
				.select({ count: count() })
				.from(presence)
				.innerJoin(generus, eq(presence.generusId, generus.id))
				.where(
					and(
						eq(presence.eventId, input.eventId),
						eq(presence.status, "Hadir"),
						eq(generus.kelompokId, input.kelompokId),
					),
				);

			const [izin] = await ctx.db
				.select({ count: count() })
				.from(presence)
				.innerJoin(generus, eq(presence.generusId, generus.id))
				.where(
					and(
						eq(presence.eventId, input.eventId),
						eq(presence.status, "Izin"),
						eq(generus.kelompokId, input.kelompokId),
					),
				);

			const [totalGenerus] = await ctx.db
				.select({ count: count() })
				.from(generus)
				.where(eq(generus.kelompokId, input.kelompokId));

			const hadirCount = Number(hadir?.count ?? 0);
			const izinCount = Number(izin?.count ?? 0);
			const totalCount = Number(totalGenerus?.count ?? 0);
			const alphaCount = totalCount - (hadirCount + izinCount);

			const calculatePercentage = (count: number, total: number) => {
				if (total === 0) return "0.00%";
				return `${((count / total) * 100).toFixed(2)}%`;
			};

			const hadirPercentage = calculatePercentage(hadirCount, totalCount);
			const izinPercentage = calculatePercentage(izinCount, totalCount);
			const alphaPercentage = calculatePercentage(alphaCount, totalCount);

			return formatResponse(
				true,
				"Berhasil mendapatkan data Presensi",
				{
					alpha: alphaCount,
					data,
					hadir: hadirCount,
					izin: izinCount,
					percentage: {
						alpha: alphaPercentage,
						hadir: hadirPercentage,
						izin: izinPercentage,
					},
					total: totalCount,
				},
				null,
			);
		}),

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
				orderBy: (presence, { desc }) => [desc(presence.createdAt)],
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
						limit,
						page,
						total: totalCount,
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
});
