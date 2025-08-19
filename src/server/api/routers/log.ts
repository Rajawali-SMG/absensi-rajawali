import { and, count, ilike } from "drizzle-orm";
import {
	formatResponseArray,
	formatResponsePagination,
} from "@/helper/response.helper";
import { logFilter } from "@/types/log";
import { log } from "../../db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const logRouter = createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.log.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Log",
			data,
			null,
		);
	}),

	getAllPaginated: protectedProcedure
		.input(logFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.log.findMany({
				limit,
				offset: page * limit,
				orderBy: (log, { desc }) => [desc(log.createdAt)],
				where: and(
					input.q ? ilike(log.event, `%${input.q}%`) : undefined,
					input.q ? ilike(log.description, `%${input.q}%`) : undefined,
				),
			});

			const [total] = await ctx.db.select({ count: count() }).from(log);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponsePagination(
				true,
				"Berhasil mendapatkan data Log",
				{ items: data, meta: { limit, page, total: totalCount, totalPages } },
				null,
			);
		}),
});
