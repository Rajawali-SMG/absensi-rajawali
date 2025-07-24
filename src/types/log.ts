import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { log } from "../server/db/schema";

type logInsert = InferInsertModel<typeof log>;
type logSelect = InferSelectModel<typeof log>;

export const logCreateSchema = z.object({
	event: z
		.string()
		.nonempty("Event tidak boleh kosong")
		.max(255, "Event maksimal 255 karakter"),
	description: z.string().nonempty("Deskripsi tidak boleh kosong"),
	user_id: z.uuid().nonempty("User tidak boleh kosong"),
});

export const logUpdateSchema = logCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const logDeleteSchema = logUpdateSchema.pick({
	id: true,
});

export const logFilter = z.object({
	limit: z.number().optional().default(9),
	page: z.number().optional().default(0),
	q: z.string().optional().default(""),
});
