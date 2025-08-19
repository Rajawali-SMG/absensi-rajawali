import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { v4 as uuid } from "uuid";
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
	id: z.string().nonempty("ID tidak boleh kosong"),
});

export const desaFilter = filterBase;

export const desaDefaultValue: DesaInsert = {
	id: uuid(),
	nama: "",
};
