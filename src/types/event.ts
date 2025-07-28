import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { event } from "../server/db/schema";
import { filterBase } from ".";

export type EventSelect = InferSelectModel<typeof event>;
export type EventInsert = InferInsertModel<typeof event>;

export const eventCreateSchema = z.object({
	title: z
		.string()
		.nonempty("Judul tidak boleh kosong")
		.max(255, "Judul maksimal 255 karakter"),
	start_date: z.iso.datetime({ local: true }),
	end_date: z.iso.datetime({ local: true }).nullable(),
	latitude: z
		.number()
		.min(-90, "Latitude minimal -90")
		.max(90, "Latitude maksimal 90")
		.nullable(),
	longitude: z
		.number()
		.min(-180, "Longitude minimal -180")
		.max(180, "Longitude maksimal 180")
		.nullable(),
	description: z.string().nullable(),
});

export const eventUpdateSchema = eventCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const eventDefaultValue: EventInsert = {
	id: "",
	title: "",
	start_date: new Date().toISOString(),
	end_date: new Date().toISOString(),
	latitude: 0,
	longitude: 0,
	description: "",
};

export const eventFilter = filterBase;
