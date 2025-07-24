// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
	date,
	doublePrecision,
	index,
	integer,
	pgEnum,
	pgTableCreator,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

import { v4 as uuid } from "uuid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `absensi-rajawali_${name}`);

export const posts = createTable(
	"post",
	(d) => ({
		id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
		name: d.varchar({ length: 256 }),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("name_idx").on(t.name)],
);

const timestamps = {
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp(),
};

export const desa = createTable("desa", {
	id: serial().primaryKey(),
	...timestamps,
	nama: varchar({ length: 256 }),
});

export const kelompok = createTable("kelompok", {
	id: varchar({ length: 3 }).primaryKey(),
	...timestamps,
	nama: varchar({ length: 50 }),
	desa_id: integer(),
});

export const jenisKelamin = pgEnum("jenis_kelamin", ["Laki-laki", "Perempuan"]);
export const pendidikanTerakhir = pgEnum("pendidikan_terakhir", [
	"PAUD",
	"TK",
	"SD",
	"SMP",
	"SMA/SMK",
	"D1-D3",
	"S1/D4",
	"S2",
	"S3",
]);
export const sambung = pgEnum("sambung", ["Aktif", "Tidak Aktif"]);
export const keterangan = pgEnum("keterangan", ["Pendatang", "Pribumi"]);
export const status = pgEnum("status", ["Hadir", "Izin", "Tidak Hadir"]);
export const role = pgEnum("role", ["Super Admin", "Admin", "User"]);
export const jenjang = pgEnum("jenjang", [
	"Paud",
	"Caberawit",
	"Pra Remaja",
	"Remaja",
	"Pra Nikah",
]);

export const generus = createTable("generus", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid()),
	...timestamps,
	nama: varchar({ length: 255 }),
	jenis_kelamin: jenisKelamin(),
	tempat_lahir: varchar({ length: 50 }),
	tanggal_lahir: date({ mode: "string" }),
	jenjang: jenjang(),
	nomer_whatsapp: varchar({ length: 15 }),
	pendidikan_terakhir: pendidikanTerakhir(),
	nama_orang_tua: varchar({ length: 255 }),
	nomer_whatsapp_orang_tua: varchar({ length: 15 }),
	sambung: sambung(),
	alamat_tempat_tinggal: varchar({ length: 255 }),
	keterangan: keterangan(),
	alamat_asal: varchar({ length: 255 }),
	kelompok_id: varchar({ length: 3 }),
});

export const user = createTable("user", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid()),
	...timestamps,
	username: varchar({ length: 50 }).unique(),
	password: varchar({ length: 255 }),
	role: role(),
});

export const log = createTable("log", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid()),
	created_at: timestamp().defaultNow().notNull(),
	event: varchar({ length: 255 }),
	description: text(),
	user_id: varchar().unique(),
});

export const event = createTable("event", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid()),
	...timestamps,
	title: varchar({ length: 255 }),
	start_date: timestamp({ mode: "string" }),
	end_date: timestamp({ mode: "string" }),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	description: varchar(),
});

export const presence = createTable("presence", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid()),
	created_at: timestamp().defaultNow().notNull(),
	status: status(),
	generus_id: varchar({ length: 255 }).notNull(),
	event_id: varchar({ length: 255 }).notNull(),
});
