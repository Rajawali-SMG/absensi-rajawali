CREATE TYPE "public"."jenis_kelamin" AS ENUM('Laki-laki', 'Perempuan');--> statement-breakpoint
CREATE TYPE "public"."jenjang" AS ENUM('Paud', 'Caberawit', 'Pra Remaja', 'Remaja', 'Pra Nikah');--> statement-breakpoint
CREATE TYPE "public"."keterangan" AS ENUM('Pendatang', 'Pribumi');--> statement-breakpoint
CREATE TYPE "public"."log_event" AS ENUM('Create', 'Update', 'Delete');--> statement-breakpoint
CREATE TYPE "public"."pendidikan_terakhir" AS ENUM('PAUD', 'TK', 'SD', 'SMP', 'SMA/SMK', 'D1-D3', 'S1/D4', 'S2', 'S3');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Super Admin', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."sambung" AS ENUM('Aktif', 'Tidak Aktif');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Hadir', 'Izin', 'Tidak Hadir');--> statement-breakpoint
CREATE TABLE "absensi-rajawali_account" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"access_token" text,
	"access_token_expires_at" timestamp,
	"account_id" text NOT NULL,
	"id_token" text,
	"password" text,
	"provider_id" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"user_id" text NOT NULL,
	CONSTRAINT "absensi-rajawali_account_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_desa" (
	"id" varchar PRIMARY KEY NOT NULL,
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
	"description" text,
	"end_date" timestamp NOT NULL,
	"latitude" double precision DEFAULT -7.03226199678915 NOT NULL,
	"longitude" double precision DEFAULT 110.46708185437986 NOT NULL,
	"start_date" timestamp NOT NULL,
	"title" varchar(255) NOT NULL,
	CONSTRAINT "absensi-rajawali_event_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_event_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_generus" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"alamat_asal" varchar(255),
	"alamat_tempat_tinggal" varchar(255),
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"jenjang" "jenjang" NOT NULL,
	"kelompok_id" varchar NOT NULL,
	"keterangan" "keterangan" NOT NULL,
	"nama" varchar(255) NOT NULL,
	"nama_orang_tua" varchar(255),
	"nomer_whatsapp" varchar(15),
	"nomer_whatsapp_orang_tua" varchar(15),
	"pendidikan_terakhir" "pendidikan_terakhir",
	"sambung" "sambung" NOT NULL,
	"tanggal_lahir" date,
	"tempat_lahir" varchar(50),
	CONSTRAINT "absensi-rajawali_generus_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_kelompok" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"code" varchar(3) NOT NULL,
	"desa_id" varchar NOT NULL,
	"nama" varchar(50) NOT NULL,
	CONSTRAINT "absensi-rajawali_kelompok_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_kelompok_code_unique" UNIQUE("code"),
	CONSTRAINT "absensi-rajawali_kelompok_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_log" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"event" "log_event" NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	CONSTRAINT "absensi-rajawali_log_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_presence" (
	"created_at" timestamp DEFAULT now() NOT NULL,
	"event_id" varchar(255) NOT NULL,
	"generus_id" varchar(255) NOT NULL,
	"generus_name" varchar(255) NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL,
	"status" "status" NOT NULL,
	CONSTRAINT "absensi-rajawali_presence_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_session" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"token" text NOT NULL,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "absensi-rajawali_session_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"name" text NOT NULL,
	"role" "role" NOT NULL,
	CONSTRAINT "absensi-rajawali_user_id_unique" UNIQUE("id"),
	CONSTRAINT "absensi-rajawali_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "absensi-rajawali_verification" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "absensi-rajawali_verification_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "absensi-rajawali_account" ADD CONSTRAINT "absensi-rajawali_account_user_id_absensi-rajawali_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."absensi-rajawali_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "absensi-rajawali_kelompok" ADD CONSTRAINT "absensi-rajawali_kelompok_desa_id_absensi-rajawali_desa_id_fk" FOREIGN KEY ("desa_id") REFERENCES "public"."absensi-rajawali_desa"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "absensi-rajawali_session" ADD CONSTRAINT "absensi-rajawali_session_user_id_absensi-rajawali_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."absensi-rajawali_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
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
CREATE INDEX "name_user_idx" ON "absensi-rajawali_user" USING btree ("name");