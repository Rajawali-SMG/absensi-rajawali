CREATE TYPE "public"."jenis_kelamin" AS ENUM('Laki-laki', 'Perempuan');--> statement-breakpoint
CREATE TYPE "public"."jenjang" AS ENUM('Paud', 'Caberawit', 'Pra Remaja', 'Remaja', 'Pra Nikah');--> statement-breakpoint
CREATE TYPE "public"."keterangan" AS ENUM('Pendatang', 'Pribumi');--> statement-breakpoint
CREATE TYPE "public"."pendidikan_terakhir" AS ENUM('PAUD', 'TK', 'SD', 'SMP', 'SMA/SMK', 'D1-D3', 'S1/D4', 'S2', 'S3');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Super Admin', 'Admin', 'User');--> statement-breakpoint
CREATE TYPE "public"."sambung" AS ENUM('Aktif', 'Tidak Aktif');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Hadir', 'Izin', 'Tidak Hadir');--> statement-breakpoint
CREATE TABLE "absensi-rajawali_desa" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"nama" varchar(256) NOT NULL,
	CONSTRAINT "absensi-rajawali_desa_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_desa_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_event" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" varchar(255) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"latitude" double precision DEFAULT -7.03226199678915,
	"longitude" double precision DEFAULT 110.46708185437986,
	"description" varchar,
	CONSTRAINT "absensi-rajawali_event_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_event_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_generus" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"nama" varchar(255) NOT NULL,
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"tempat_lahir" varchar(50) NOT NULL,
	"tanggal_lahir" date NOT NULL,
	"jenjang" "jenjang" NOT NULL,
	"nomer_whatsapp" varchar(15),
	"pendidikan_terakhir" "pendidikan_terakhir" NOT NULL,
	"nama_orang_tua" varchar(255),
	"nomer_whatsapp_orang_tua" varchar(15),
	"sambung" "sambung" NOT NULL,
	"alamat_tempat_tinggal" varchar(255) NOT NULL,
	"keterangan" "keterangan" NOT NULL,
	"alamat_asal" varchar(255),
	"kelompok_id" varchar(3) NOT NULL,
	CONSTRAINT "absensi-rajawali_generus_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_kelompok" (
	"id" varchar(3) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"nama" varchar(50) NOT NULL,
	"desa_id" integer NOT NULL,
	CONSTRAINT "absensi-rajawali_kelompok_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_kelompok_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_log" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"event" varchar(255) NOT NULL,
	"description" text,
	"user_id" varchar NOT NULL,
	CONSTRAINT "absensi-rajawali_log_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_log_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_presence" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "status" NOT NULL,
	"generus_id" varchar(255) NOT NULL,
	"event_id" varchar(255) NOT NULL,
	CONSTRAINT "absensi-rajawali_presence_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_presence_generus_id_unique" UNIQUE("generus_id"),
	CONSTRAINT "absensi-rajawali_presence_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" text NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "absensi-rajawali_user_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX "nama_desa_idx" ON "absensi-rajawali_desa" USING btree ("nama");--> statement-breakpoint
CREATE INDEX "title_event_idx" ON "absensi-rajawali_event" USING btree ("title");--> statement-breakpoint
CREATE INDEX "nama_generus_idx" ON "absensi-rajawali_generus" USING btree ("nama");--> statement-breakpoint
CREATE INDEX "jenis_kelamin_generus_idx" ON "absensi-rajawali_generus" USING btree ("jenis_kelamin");--> statement-breakpoint
CREATE INDEX "jenjang_generus_idx" ON "absensi-rajawali_generus" USING btree ("jenjang");--> statement-breakpoint
CREATE INDEX "pendidikan_terakhir_generus_idx" ON "absensi-rajawali_generus" USING btree ("pendidikan_terakhir");--> statement-breakpoint
CREATE INDEX "sambung_generus_idx" ON "absensi-rajawali_generus" USING btree ("sambung");--> statement-breakpoint
CREATE INDEX "keterangan_generus_idx" ON "absensi-rajawali_generus" USING btree ("keterangan");--> statement-breakpoint
CREATE INDEX "kelompok_id_idx" ON "absensi-rajawali_generus" USING btree ("kelompok_id");--> statement-breakpoint
CREATE INDEX "nama_kelompok_idx" ON "absensi-rajawali_kelompok" USING btree ("nama");--> statement-breakpoint
CREATE INDEX "desa_id_idx" ON "absensi-rajawali_kelompok" USING btree ("desa_id");--> statement-breakpoint
CREATE INDEX "event_log_idx" ON "absensi-rajawali_log" USING btree ("event");--> statement-breakpoint
CREATE INDEX "user_id_log_idx" ON "absensi-rajawali_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "username_user_idx" ON "absensi-rajawali_user" USING btree ("username");--> statement-breakpoint
CREATE INDEX "role_user_idx" ON "absensi-rajawali_user" USING btree ("role");