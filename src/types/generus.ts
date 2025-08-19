import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import {
	type generus,
	jenisKelamin,
	jenjang,
	keterangan,
	pendidikanTerakhir,
	sambung,
} from "../server/db/schema";
import { filterBase } from ".";

export type GenerusSelect = InferSelectModel<typeof generus>;
export type GenerusInsert = InferInsertModel<typeof generus>;

const jenisKelaminSchema = createSelectSchema(jenisKelamin);
export const jenjangSchema = createSelectSchema(jenjang);
const pendidikanTerakhirSchema = createSelectSchema(pendidikanTerakhir);
const sambungSchema = createSelectSchema(sambung);
const keteranganSchema = createSelectSchema(keterangan);

export type JenisKelaminType = z.infer<typeof jenisKelaminSchema>;
export type JenjangType = z.infer<typeof jenjangSchema>;
export type PendidikanTerakhirType = z.infer<typeof pendidikanTerakhirSchema>;
export type SambungType = z.infer<typeof sambungSchema>;
export type KeteranganType = z.infer<typeof keteranganSchema>;

export const generusCreateSchema = z.object({
	alamatAsal: z.string().optional().nullable(),
	alamatTempatTinggal: z.string().nonempty("Alamat tidak boleh kosong"),
	jenisKelamin: jenisKelaminSchema,
	jenjang: jenjangSchema,
	kelompokId: z.string().nonempty("Kelompok tidak boleh kosong"),
	keterangan: keteranganSchema,
	nama: z
		.string()
		.nonempty("Nama tidak boleh kosong")
		.max(255, "Nama maksimal 255 karakter"),
	namaOrangTua: z.string().optional().nullable(),
	nomerWhatsapp: z
		.string()
		.max(15, "Nomor WhatsApp maksimal 15 karakter")
		.optional()
		.nullable(),
	nomerWhatsappOrangTua: z.string().optional().nullable(),
	pendidikanTerakhir: pendidikanTerakhirSchema,
	sambung: sambungSchema,
	tanggalLahir: z.iso.date(),
	tempatLahir: z
		.string()
		.nonempty("Tempat Lahir tidak boleh kosong")
		.max(50, "Tempat Lahir maksimal 50 karakter"),
});

export const generusUpdateSchema = generusCreateSchema.extend({
	id: z.string().nonempty("ID tidak boleh kosong"),
});

export const generusFilter = filterBase.extend({
	jenisKelamin: z.union([jenisKelaminSchema, z.literal(""), z.undefined()]),
	jenjang: z.union([jenjangSchema, z.literal(""), z.undefined()]),
	kelompokId: z.string().optional(),
	keterangan: z.union([keteranganSchema, z.literal(""), z.undefined()]),
	pendidikanTerakhir: z.union([
		pendidikanTerakhirSchema,
		z.literal(""),
		z.undefined(),
	]),
	sambung: z.union([sambungSchema, z.literal(""), z.undefined()]),
});

export const defaultGenerus: GenerusInsert = {
	alamatAsal: "",
	alamatTempatTinggal: "",
	id: "",
	jenisKelamin: "Laki-laki",
	jenjang: "Paud",
	kelompokId: "",
	keterangan: "Pendatang",
	nama: "",
	namaOrangTua: "",
	nomerWhatsapp: "",
	nomerWhatsappOrangTua: "",
	pendidikanTerakhir: "PAUD",
	sambung: "Tidak Aktif",
	tanggalLahir: new Date().toDateString(),
	tempatLahir: "",
};
