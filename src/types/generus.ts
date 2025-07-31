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
	jenisKelamin: jenisKelaminSchema,
	tempatLahir: z
		.string()
		.nonempty("Tempat Lahir tidak boleh kosong")
		.max(50, "Tempat Lahir maksimal 50 karakter"),
	tanggalLahir: z.iso.date(),
	jenjang: jenjangSchema,
	nomerWhatsapp: z
		.string()
		.max(15, "Nomor WhatsApp maksimal 15 karakter")
		.optional()
		.nullable(),
	pendidikanTerakhir: pendidikanTerakhirSchema,
	namaOrangTua: z.string().optional().nullable(),
	nomerWhatsappOrangTua: z.string().optional().nullable(),
	sambung: sambungSchema,
	alamatTempatTinggal: z.string().nonempty("Alamat tidak boleh kosong"),
	keterangan: keteranganSchema,
	alamatAsal: z.string().optional().nullable(),
	kelompokId: z.string().nonempty("Kelompok tidak boleh kosong"),
});

export const generusUpdateSchema = generusCreateSchema.extend({
	id: z.uuid().nonempty("ID tidak boleh kosong"),
});

export const generusFilter = filterBase.extend({
	jenisKelamin: z.union([jenisKelaminSchema, z.literal(""), z.undefined()]),
	jenjang: z.union([jenjangSchema, z.literal(""), z.undefined()]),
	pendidikanTerakhir: z.union([
		pendidikanTerakhirSchema,
		z.literal(""),
		z.undefined(),
	]),
	sambung: z.union([sambungSchema, z.literal(""), z.undefined()]),
	keterangan: z.union([keteranganSchema, z.literal(""), z.undefined()]),
	kelompokId: z.string().optional(),
});

export const defaultGenerus: GenerusInsert = {
	id: "",
	nama: "",
	jenisKelamin: "Laki-laki",
	tempatLahir: "",
	tanggalLahir: new Date().toDateString(),
	jenjang: "Paud",
	nomerWhatsapp: "",
	pendidikanTerakhir: "PAUD",
	namaOrangTua: "",
	nomerWhatsappOrangTua: "",
	sambung: "Tidak Aktif",
	alamatTempatTinggal: "",
	keterangan: "Pendatang",
	alamatAsal: "",
	kelompokId: "",
};
