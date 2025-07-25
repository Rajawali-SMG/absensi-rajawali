import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { event } from "../server/db/schema";
import { filterBase } from "./api";

export type EventSelect = InferSelectModel<typeof event>;
export type EventInsert = InferInsertModel<typeof event>;

export const eventCreateSchema = z.object({
	title: z
		.string()
		.nonempty("Judul tidak boleh kosong")
		.max(255, "Judul maksimal 255 karakter"),
	start_date: z.iso.datetime({ local: true }),
	end_date: z.iso.datetime({ local: true }).nullable().optional(),
	latitude: z
		.number()
		.min(-90, "Latitude minimal -90")
		.max(90, "Latitude maksimal 90")
		.nullable()
		.optional(),
	longitude: z
		.number()
		.min(-180, "Longitude minimal -180")
		.max(180, "Longitude maksimal 180")
		.nullable()
		.optional(),
	description: z.string().optional().nullable(),
});

export const eventUpdateSchema = eventCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong").optional(),
});

export const eventDeleteSchema = eventUpdateSchema.pick({
	id: true,
});

export const eventDefaultValue: EventInsert = {
	title: "",
	start_date: new Date().toISOString(),
	end_date: new Date().toISOString(),
	latitude: 0,
	longitude: 0,
	description: "",
};

export const eventDefaultUpdate: EventInsert = {
	title: "",
	start_date: new Date().toISOString(),
	end_date: new Date().toISOString(),
	latitude: 0,
	longitude: 0,
	description: "",
};

export const eventFilter = filterBase;
