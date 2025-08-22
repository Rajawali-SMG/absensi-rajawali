import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { presence } from "../server/db/schema";
import { filterBase } from ".";

export type PresenceSelect = InferSelectModel<typeof presence>;
export type PresenceInsert = InferInsertModel<typeof presence>;

export const presenceCreateSchema = z.object({
	eventId: z.string().nonempty("Event tidak boleh kosong"),
	generusId: z.string().nonempty("Generus tidak boleh kosong"),
	generusName: z.string().nonempty("Generus tidak boleh kosong"),
	status: z
		.enum(["Hadir", "Izin", "Tidak Hadir"], {
			error: "Status tidak boleh kosong",
		})
		.default("Tidak Hadir"),
});

export const presenceUpdateSchema = presenceCreateSchema.extend({
	id: z.string().nonempty("ID tidak boleh kosong"),
});

export const presenceFilter = filterBase.omit({
	q: true,
});
