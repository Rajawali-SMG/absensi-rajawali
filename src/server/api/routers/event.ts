import { TRPCError } from "@trpc/server";
import { and, count, eq } from "drizzle-orm";
import {
	formatResponse,
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { idBase } from "@/types";
import {
	eventCreateSchema,
	eventFilter,
	eventUpdateSchema,
} from "@/types/event";
import { event, log, presence } from "../../db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
	countGenerus: publicProcedure.input(idBase).query(async ({ ctx, input }) => {
		const [hadir] = await ctx.db
			.select({ count: count() })
			.from(presence)
			.where(and(eq(presence.eventId, input.id), eq(presence.status, "Hadir")));

		const [izin] = await ctx.db
			.select({ count: count() })
			.from(presence)
			.where(and(eq(presence.eventId, input.id), eq(presence.status, "Izin")));

		return formatResponse(
			true,
			"Berhasil mendapatkan semua data Generus",
			{ hadir: hadir?.count ?? 0, izin: izin?.count ?? 0 },
			null,
		);
	}),

	createEvent: protectedProcedure
		.input(eventCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const existingEvent = await ctx.db.query.event.findFirst({
				where: eq(event.title, input.title),
			});

			if (existingEvent) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Judul sudah didaftarkan, silahkan gunakan judul lain",
				});
			}

			const data = await ctx.db.insert(event).values(input);

			await ctx.db.insert(log).values({
				description: `Menambahkan Data Event: ${input.title}`,
				event: "Create",
				userId: ctx.session.user.email,
			});

			return formatResponse(
				true,
				"Berhasil menambahkan data Event",
				data,
				null,
			);
		}),

	deleteEvent: protectedProcedure
		.input(idBase)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}
			const data = await ctx.db.delete(event).where(eq(event.id, input.id));

			await ctx.db.insert(log).values({
				description: `Menghapus Data Event: ${input.id}`,
				event: "Delete",
				userId: ctx.session.user.email,
			});

			return formatResponse(true, "Berhasil menghapus data Event", data, null);
		}),

	getAll: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.event.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Event",
			data,
			null,
		);
	}),

	getAllPaginated: protectedProcedure
		.input(eventFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.event.findMany({
				limit,
				offset: page * limit,
				orderBy: (event, { desc }) => [desc(event.updatedAt)],
			});

			const [total] = await ctx.db.select({ count: count() }).from(event);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data Event",
				{ items: data, meta: { limit, page, total: totalCount, totalPages } },
				null,
			);
		}),

	getOneEventPublic: publicProcedure
		.input(idBase)
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.query.event.findFirst({
				where: eq(event.id, input.id),
			});

			if (!data) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Data Event tidak ditemukan",
				});
			}
			let status = "not-started";
			if (
				new Date(data.startDate) <= new Date() &&
				new Date(data.endDate) >= new Date()
			) {
				status = "active";
			}
			if (new Date(data.endDate) <= new Date()) {
				status = "ended";
			}

			return formatResponse(
				true,
				"Berhasil mendapatkan data Event",
				{ ...data, status },
				null,
			);
		}),

	updateEvent: protectedProcedure
		.input(eventUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}
			const data = await ctx.db
				.update(event)
				.set(input)
				.where(eq(event.id, input.id));

			await ctx.db.insert(log).values({
				description: `Mengubah Data Event: ${input.title}`,
				event: "Update",
				userId: ctx.session.user.email,
			});

			return formatResponse(true, "Berhasil mengubah data Event", data, null);
		}),
});
