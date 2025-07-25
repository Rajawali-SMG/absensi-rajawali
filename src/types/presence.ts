import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { presence } from "../server/db/schema";

export type PresenceSelect = InferSelectModel<typeof presence>;
export type PresenceInsert = InferInsertModel<typeof presence>;

export const presenceCreateSchema = z.object({
	status: z
		.enum(["Hadir", "Izin", "Tidak Hadir"], {
			error: "Status tidak boleh kosong",
		})
		.default("Tidak Hadir"),
	event_id: z.string().nonempty("Event tidak boleh kosong"),
	generus_id: z.string().nonempty("Generus tidak boleh kosong"),
});

export const presenceUpdateSchema = presenceCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const presenceDeleteSchema = presenceUpdateSchema.pick({
	id: true,
});

export const presenceFilter = z.object({
	limit: z.number().optional().default(9),
	page: z.number().optional().default(0),
});
