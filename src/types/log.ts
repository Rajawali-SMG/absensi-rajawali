import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { type log, logEvent } from "../server/db/schema";
import { filterBase } from ".";

export type LogInsert = InferInsertModel<typeof log>;
export type LogSelect = InferSelectModel<typeof log>;

const logEventSchema = createSelectSchema(logEvent);

export const logCreateSchema = z.object({
	description: z.string().nonempty("Deskripsi tidak boleh kosong"),
	event: logEventSchema,
	userId: z.string().nonempty("User tidak boleh kosong"),
});

export const logUpdateSchema = logCreateSchema.extend({
	id: z.string().nonempty("ID tidak boleh kosong"),
});

export const logFilter = filterBase;
