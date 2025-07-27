import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	eventCreateSchema,
	eventDeleteSchema,
	eventFilter,
	eventUpdateSchema,
} from "@/types/event";
import { idBase } from "../../../types/api";
import { event } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.event.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Event",
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
		.input(eventFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.event.findMany({
				limit,
				offset: page * limit,
			});

			const [total] = await ctx.db.select({ count: count() }).from(event);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Event",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
				null,
			);
		}),

	getOneEvent: publicProcedure.input(idBase).query(async ({ ctx, input }) => {
		const data = await ctx.db.query.event.findFirst({
			where: eq(event.id, input.id),
		});

		if (!data) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Data Event tidak ditemukan",
			});
		}

		return formatResponse(true, "Berhasil mendapatkan data Event", data, null);
	}),

	createEvent: publicProcedure
		.input(eventCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.insert(event).values(input);

			return formatResponse(
				true,
				"Berhasil menambahkan data Event",
				data,
				null,
			);
		}),

	updateEvent: publicProcedure
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

			return formatResponse(true, "Berhasil mengubah data Event", data, null);
		}),

	deleteEvent: publicProcedure
		.input(eventDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "ID tidak ditemukan",
				});
			}
			const data = await ctx.db.delete(event).where(eq(event.id, input.id));

			return formatResponse(true, "Berhasil menghapus data Event", data, null);
		}),
});
