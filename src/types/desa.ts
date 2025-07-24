import type { InferSelectModel } from "drizzle-orm";
import z from "zod";
import type { desa } from "../server/db/schema";
import { filterBase } from "./api";

export const desaCreateSchema = z.object({
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(50, "Nama maksimal 50 karakter"),
});

export const desaUpdateSchema = desaCreateSchema.extend({
	id: z.int().min(1, "ID tidak boleh kosong").max(32767, "ID maksimal 32767"),
});

export const desaDeleteSchema = desaUpdateSchema.pick({
	id: true,
});

export const desaFilter = filterBase;

export type DesaBase = InferSelectModel<typeof desa>;
