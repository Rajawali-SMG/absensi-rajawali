import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { event } from "../server/db/schema";
import { filterBase } from ".";

export type EventSelect = InferSelectModel<typeof event>;
export type EventInsert = InferInsertModel<typeof event>;

export const eventCreateSchema = z.object({
	description: z.string().nullable().optional(),
	endDate: z.string(),
	latitude: z
		.number()
		.min(-90, "Latitude minimal -90")
		.max(90, "Latitude maksimal 90")
		.optional(),
	longitude: z
		.number()
		.min(-180, "Longitude minimal -180")
		.max(180, "Longitude maksimal 180")
		.optional(),
	startDate: z.string(),
	title: z
		.string()
		.nonempty("Judul tidak boleh kosong")
		.max(255, "Judul maksimal 255 karakter"),
});

export const eventUpdateSchema = eventCreateSchema.extend({
	id: z.string().nonempty("ID tidak boleh kosong"),
});

export const eventDefaultValue: EventInsert = {
	description: "",
	endDate: new Date().toISOString(),
	id: "",
	latitude: 0,
	longitude: 0,
	startDate: new Date().toISOString(),
	title: "",
};

export const eventFilter = filterBase;
