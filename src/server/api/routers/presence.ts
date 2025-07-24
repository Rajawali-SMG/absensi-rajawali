import { count, eq } from "drizzle-orm";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	presenceCreateSchema,
	presenceDeleteSchema,
	presenceFilter,
	presenceUpdateSchema,
} from "@/types/presence";
import { presence } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const presenceRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.presence.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Presensi",
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

			return formatResponseArray(
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

	createPresence: publicProcedure
		.input(presenceCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.insert(presence).values(input);

			return formatResponse(
				true,
				"Berhasil menambahkan data Presensi",
				data,
				null,
			);
		}),

	updatePresence: publicProcedure
		.input(presenceUpdateSchema)
		.mutation(async ({ ctx, input }) => {
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

	deletePresence: publicProcedure
		.input(presenceDeleteSchema)
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
});
