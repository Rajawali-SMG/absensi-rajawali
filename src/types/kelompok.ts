import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { kelompok } from "../server/db/schema";
import { filterBase } from ".";

export type KelompokSelect = InferSelectModel<typeof kelompok>;
export type KelompokInsert = InferInsertModel<typeof kelompok>;

export const kelompokCreateSchema = z.object({
	code: z
		.string()
		.nonempty("Kode tidak boleh kosong")
		.max(3, "Kode maksimal 3 karakter"),
	desaId: z.string().nonempty("Desa tidak boleh kosong"),
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(50, "Nama maksimal 50 karakter"),
});

export const kelompokUpdateSchema = kelompokCreateSchema.extend({
	id: z.string().nonempty("ID tidak boleh kosong"),
});

export const kelompokFilter = filterBase.extend({
	desaId: z.string().optional(),
});

export const kelompokDefaultValue: KelompokInsert = {
	code: "",
	desaId: "",
	id: "",
	nama: "",
};
