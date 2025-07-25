import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import {
	generus,
	jenisKelamin,
	jenjang,
	keterangan,
	pendidikanTerakhir,
	sambung,
} from "../server/db/schema";
import { filterBase } from "./api";

export type GenerusSelect = InferSelectModel<typeof generus>;
export type GenerusInsert = InferInsertModel<typeof generus>;

const jenisKelaminSchema = createSelectSchema(jenisKelamin);
const jenjangSchema = createSelectSchema(jenjang);
const pendidikanTerakhirSchema = createSelectSchema(pendidikanTerakhir);
const sambungSchema = createSelectSchema(sambung);
const keteranganSchema = createSelectSchema(keterangan);

export type JenisKelaminType = z.infer<typeof jenisKelaminSchema>;
export type JenjangType = z.infer<typeof jenjangSchema>;
export type PendidikanTerakhirType = z.infer<typeof pendidikanTerakhirSchema>;
export type SambungType = z.infer<typeof sambungSchema>;
export type KeteranganType = z.infer<typeof keteranganSchema>;

export const generusCreateSchema = z.object({
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(255, "Nama maksimal 255 karakter"),
	jenis_kelamin: jenisKelaminSchema,
	tempat_lahir: z
		.string()
		.nonempty("Tempat Lahir tidak boleh kosong")
		.max(50, "Tempat Lahir maksimal 50 karakter"),
	tanggal_lahir: z.iso.date(),
	jenjang: jenjangSchema,
	nomer_whatsapp: z
		.string()
		.max(15, "Nomor WhatsApp maksimal 15 karakter")
		.optional()
		.nullable(),
	pendidikan_terakhir: pendidikanTerakhirSchema,
	nama_orang_tua: z.string().optional().nullable(),
	nomer_whatsapp_orang_tua: z.string().optional().nullable(),
	sambung: sambungSchema,
	alamat_tempat_tinggal: z.string().nonempty("Alamat tidak boleh kosong"),
	keterangan: keteranganSchema,
	alamat_asal: z.string().optional().nullable(),
	kelompok_id: z.string().nonempty("Kelompok tidak boleh kosong"),
});

export const generusUpdateSchema = generusCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const generusDeleteSchema = generusUpdateSchema.pick({
	id: true,
});

export const generusFilter = filterBase.extend({
	jenis_kelamin: jenisKelaminSchema.optional(),
	jenjang: jenjangSchema.optional(),
	pendidikan_terakhir: pendidikanTerakhirSchema.optional(),
	sambung: sambungSchema.optional(),
	keterangan: keteranganSchema.optional(),
	kelompok_id: z.string().optional(),
});

export const defaultGenerus: GenerusInsert = {
	nama: "",
	jenis_kelamin: "Laki-laki",
	tempat_lahir: "",
	tanggal_lahir: new Date().toDateString(),
	jenjang: "Paud",
	nomer_whatsapp: "",
	pendidikan_terakhir: "PAUD",
	nama_orang_tua: "",
	nomer_whatsapp_orang_tua: "",
	sambung: "Tidak Aktif",
	alamat_tempat_tinggal: "",
	keterangan: "Pendatang",
	alamat_asal: "",
	kelompok_id: "",
};

export const defaultGenerusUpdate: z.infer<typeof generusUpdateSchema> = {
	id: "",
	...defaultGenerus,
};
