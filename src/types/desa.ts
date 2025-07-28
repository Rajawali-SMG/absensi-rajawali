import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { desa } from "../server/db/schema";
import { filterBase } from ".";

export type DesaSelect = InferSelectModel<typeof desa>;
export type DesaInsert = InferInsertModel<typeof desa>;

export const desaCreateSchema = z.object({
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(50, "Nama maksimal 50 karakter"),
});

export const desaUpdateSchema = desaCreateSchema.extend({
	id: z.int().min(1, "ID tidak boleh kosong").max(32767, "ID maksimal 32767"),
});

export const desaFilter = filterBase;

export const desaDefaultValue: DesaInsert = {
	id: 0,
	nama: "",
};
