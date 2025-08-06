import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { kelompok } from "../server/db/schema";
import { filterBase } from ".";

export type KelompokSelect = InferSelectModel<typeof kelompok>;
export type KelompokInsert = InferInsertModel<typeof kelompok>;

export const kelompokCreateSchema = z.object({
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(50, "Nama maksimal 50 karakter"),
	code: z
		.string()
		.nonempty("Kode tidak boleh kosong")
		.min(3, "Kode minimal 3 karakter")
		.max(3, "Kode maksimal 3 karakter"),
	desaId: z.number().min(1, "Desa tidak boleh kosong"),
});

export const kelompokUpdateSchema = kelompokCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const kelompokFilter = filterBase.extend({
	desaId: z.number().optional(),
});

export const kelompokDefaultValue: KelompokInsert = {
	id: "",
	nama: "",
	code: "",
	desaId: 0,
};
