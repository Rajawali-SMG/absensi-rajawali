// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
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

const timestamps = {
	created_at: timestamp().defaultNow().notNull(),
	updated_at: timestamp()
		.defaultNow()
		.$onUpdateFn(() => new Date())
		.notNull(),
};

export const desa = createTable(
	"desa",
	{
		id: serial().primaryKey().notNull().unique(),
		...timestamps,
		nama: varchar({ length: 256 }).unique().notNull(),
	},
	(table) => [index("nama_desa_idx").on(table.nama)],
);

export const desaRelations = relations(desa, ({ many }) => ({
	kelompok: many(kelompok),
}));

export const kelompok = createTable(
	"kelompok",
	{
		id: varchar({ length: 3 }).primaryKey().notNull().unique(),
		...timestamps,
		nama: varchar({ length: 50 }).unique().notNull(),
		desa_id: integer().notNull(),
	},
	(table) => [
		index("nama_kelompok_idx").on(table.nama),
		index("desa_id_idx").on(table.desa_id),
	],
);

export const kelompokRelations = relations(kelompok, ({ one, many }) => ({
	desa: one(desa, {
		fields: [kelompok.desa_id],
		references: [desa.id],
	}),
	generus: many(generus),
}));

export const generus = createTable(
	"generus",
	{
		id: varchar()
			.primaryKey()
			.$defaultFn(() => uuid())
			.notNull()
			.unique(),
		...timestamps,
		nama: varchar({ length: 255 }).notNull(),
		jenis_kelamin: jenisKelamin().notNull(),
		tempat_lahir: varchar({ length: 50 }).notNull(),
		tanggal_lahir: date({ mode: "string" }).notNull(),
		jenjang: jenjang().notNull(),
		nomer_whatsapp: varchar({ length: 15 }),
		pendidikan_terakhir: pendidikanTerakhir().notNull(),
		nama_orang_tua: varchar({ length: 255 }),
		nomer_whatsapp_orang_tua: varchar({ length: 15 }),
		sambung: sambung().notNull(),
		alamat_tempat_tinggal: varchar({ length: 255 }).notNull(),
		keterangan: keterangan().notNull(),
		alamat_asal: varchar({ length: 255 }),
		kelompok_id: varchar({ length: 3 }).notNull(),
	},
	(table) => [
		index("nama_generus_idx").on(table.nama),
		index("jenis_kelamin_generus_idx").on(table.jenis_kelamin),
		index("jenjang_generus_idx").on(table.jenjang),
		index("pendidikan_terakhir_generus_idx").on(table.pendidikan_terakhir),
		index("sambung_generus_idx").on(table.sambung),
		index("keterangan_generus_idx").on(table.keterangan),
		index("kelompok_id_idx").on(table.kelompok_id),
	],
);

export const generusRelations = relations(generus, ({ one, many }) => ({
	kelompok: one(kelompok, {
		fields: [generus.kelompok_id],
		references: [kelompok.id],
	}),
	presence: many(presence),
}));

export const user = createTable(
	"user",
	{
		id: varchar()
			.primaryKey()
			.$defaultFn(() => uuid())
			.notNull()
			.unique(),
		...timestamps,
		username: varchar({ length: 50 }).unique().notNull(),
		password: text().notNull(),
		role: role().notNull(),
	},
	(table) => [
		index("username_user_idx").on(table.username),
		index("role_user_idx").on(table.role),
	],
);

export const userRelations = relations(user, ({ many }) => ({
	log: many(log),
}));

export const log = createTable(
	"log",
	{
		id: varchar()
			.primaryKey()
			.$defaultFn(() => uuid())
			.notNull()
			.unique(),
		created_at: timestamp().defaultNow().notNull(),
		event: varchar({ length: 255 }).notNull(),
		description: text(),
		user_id: varchar().unique().notNull(),
	},
	(table) => [
		index("event_log_idx").on(table.event),
		index("user_id_log_idx").on(table.user_id),
	],
);

export const logRelations = relations(log, ({ one }) => ({
	user: one(user, {
		fields: [log.user_id],
		references: [user.id],
	}),
}));

export const event = createTable(
	"event",
	{
		id: varchar()
			.primaryKey()
			.$defaultFn(() => uuid())
			.notNull()
			.unique(),
		...timestamps,
		title: varchar({ length: 255 }).notNull().unique(),
		start_date: timestamp({ mode: "string" }).notNull(),
		end_date: timestamp({ mode: "string" }),
		latitude: doublePrecision().default(-7.03226199678915),
		longitude: doublePrecision().default(110.46708185437986),
		description: varchar(),
	},
	(table) => [index("title_event_idx").on(table.title)],
);

export const eventRelations = relations(event, ({ many }) => ({
	presence: many(presence),
}));

export const presence = createTable("presence", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid())
		.notNull()
		.unique(),
	created_at: timestamp().defaultNow().notNull(),
	status: status().notNull(),
	generus_id: varchar({ length: 255 }).notNull().unique(),
	event_id: varchar({ length: 255 }).notNull().unique(),
});

export const presenceRelations = relations(presence, ({ one }) => ({
	generus: one(generus, {
		fields: [presence.generus_id],
		references: [generus.id],
	}),
	event: one(event, {
		fields: [presence.event_id],
		references: [event.id],
	}),
}));
