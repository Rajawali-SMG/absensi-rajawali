import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { kelompok } from "../server/db/schema";
import { filterBase } from ".";

export type KelompokSelect = InferSelectModel<typeof kelompok>;
export type KelompokInsert = InferInsertModel<typeof kelompok>;

export const kelompokCreateSchema = z.object({
	id: z.string().nonempty("ID tidak boleh kosong"),
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(50, "Nama maksimal 50 karakter"),
	desa_id: z.number().min(1, "Desa tidak boleh kosong"),
});

export const kelompokUpdateSchema = kelompokCreateSchema;

export const kelompokFilter = filterBase.extend({
	desa_id: z.number().optional(),
});

export const kelompokDefaultValue: KelompokInsert = {
	id: "",
	nama: "",
	desa_id: 0,
};
