import { TRPCError } from "@trpc/server";
import { count, eq, ilike, or } from "drizzle-orm";
import { formatResponse, formatResponseArray } from "@/helper/response.helper";
import {
	logCreateSchema,
	logDeleteSchema,
	logFilter,
	logUpdateSchema,
} from "@/types/log";
import { idBase } from "../../../types/api";
import { log } from "../../db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const logRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const data = await ctx.db.query.log.findMany();

		return formatResponseArray(
			true,
			"Berhasil mendapatkan semua data Log",
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
		.input(logFilter)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;
			const page = input.page ?? 0;
			const data = await ctx.db.query.log.findMany({
				limit,
				offset: page * limit,
				where: or(
					input.q ? ilike(log.event, `%${input.q}%`) : undefined,
					input.q ? ilike(log.description, `%${input.q}%`) : undefined,
				),
			});

			const [total] = await ctx.db.select({ count: count() }).from(log);

			const totalCount = total?.count ?? 0;
			const totalPages = Math.ceil(totalCount / limit);

			return formatResponseArray(
				true,
				"Berhasil mendapatkan data Log",
				{ items: data, meta: { total: totalCount, page, limit, totalPages } },
				null,
			);
		}),

	getOneLog: publicProcedure.input(idBase).query(async ({ ctx, input }) => {
		const data = await ctx.db.query.log.findFirst({
			where: eq(log.id, input.id),
		});

		if (!data) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Data Log tidak ditemukan",
			});
		}

		return formatResponse(true, "Berhasil mendapatkan data Log", data, null);
	}),

	createLog: publicProcedure
		.input(logCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.insert(log).values(input);

			return formatResponse(true, "Berhasil menambahkan data Log", data, null);
		}),

	updateLog: publicProcedure
		.input(logUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db
				.update(log)
				.set(input)
				.where(eq(log.id, input.id));

			return formatResponse(true, "Berhasil mengubah data Log", data, null);
		}),

	deleteLog: publicProcedure
		.input(logDeleteSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.db.delete(log).where(eq(log.id, input.id));

			return formatResponse(true, "Berhasil menghapus data Log", data, null);
		}),
});
