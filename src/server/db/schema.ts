// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
	boolean,
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
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp()
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
		desaId: integer().notNull(),
	},
	(table) => [
		index("nama_kelompok_idx").on(table.nama),
		index("desa_id_idx").on(table.desaId),
	],
);

export const kelompokRelations = relations(kelompok, ({ one, many }) => ({
	desa: one(desa, {
		fields: [kelompok.desaId],
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
		jenisKelamin: jenisKelamin().notNull(),
		tempatLahir: varchar({ length: 50 }).notNull(),
		tanggalLahir: date({ mode: "string" }).notNull(),
		jenjang: jenjang().notNull(),
		nomerWhatsapp: varchar({ length: 15 }),
		pendidikanTerakhir: pendidikanTerakhir().notNull(),
		namaOrangTua: varchar({ length: 255 }),
		nomerWhatsappOrangTua: varchar({ length: 15 }),
		sambung: sambung().notNull(),
		alamatTempatTinggal: varchar({ length: 255 }).notNull(),
		keterangan: keterangan().notNull(),
		alamatAsal: varchar({ length: 255 }),
		kelompokId: varchar({ length: 3 }).notNull(),
	},
	(table) => [
		index("nama_generus_idx").on(table.nama),
		index("jenis_kelamin_generus_idx").on(table.jenisKelamin),
		index("jenjang_generus_idx").on(table.jenjang),
		index("pendidikan_terakhir_generus_idx").on(table.pendidikanTerakhir),
		index("sambung_generus_idx").on(table.sambung),
		index("keterangan_generus_idx").on(table.keterangan),
		index("kelompok_id_idx").on(table.kelompokId),
	],
);

export const generusRelations = relations(generus, ({ one, many }) => ({
	kelompok: one(kelompok, {
		fields: [generus.kelompokId],
		references: [kelompok.id],
	}),
	presence: many(presence),
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
		startDate: timestamp({ mode: "string" }).notNull(),
		endDate: timestamp({ mode: "string" }),
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
	createdAt: timestamp().defaultNow().notNull(),
	status: status().notNull(),
	generusId: varchar({ length: 255 }).notNull().unique(),
	eventId: varchar({ length: 255 }).notNull().unique(),
});

export const presenceRelations = relations(presence, ({ one }) => ({
	generus: one(generus, {
		fields: [presence.generusId],
		references: [generus.id],
	}),
	event: one(event, {
		fields: [presence.eventId],
		references: [event.id],
	}),
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
		name: text().notNull(),
		email: text().notNull().unique(),
		emailVerified: boolean()
			.$defaultFn(() => false)
			.notNull(),
		image: text(),
		// role: role().notNull(),
	},
	(table) => [
		index("name_user_idx").on(table.name),
		// index("role_user_idx").on(table.role),
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
		createdAt: timestamp().defaultNow().notNull(),
		event: varchar({ length: 255 }).notNull(),
		description: text(),
		userId: varchar().unique().notNull(),
	},
	(table) => [
		index("event_log_idx").on(table.event),
		index("user_id_log_idx").on(table.userId),
	],
);

export const logRelations = relations(log, ({ one }) => ({
	user: one(user, {
		fields: [log.userId],
		references: [user.id],
	}),
}));

export const session = createTable("session", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid())
		.notNull()
		.unique(),
	expiresAt: timestamp().notNull(),
	token: text().notNull().unique(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = createTable("account", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid())
		.notNull()
		.unique(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp(),
	refreshTokenExpiresAt: timestamp(),
	scope: text(),
	password: text(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
});

export const verification = createTable("verification", {
	id: varchar()
		.primaryKey()
		.$defaultFn(() => uuid())
		.notNull()
		.unique(),
	...timestamps,
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp().notNull(),
});
