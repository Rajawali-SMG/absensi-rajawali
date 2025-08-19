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
	desaId: z.string().nonempty("Desa tidak boleh kosong"),
});

export const kelompokUpdateSchema = kelompokCreateSchema.extend({
	id: z.string().nonempty("ID tidak boleh kosong"),
});

export const kelompokFilter = filterBase.extend({
	desaId: z.string().optional(),
});

export const kelompokDefaultValue: KelompokInsert = {
	id: "",
	nama: "",
	desaId: "",
};
