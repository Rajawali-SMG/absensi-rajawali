import { fakerID_ID } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { v4 as uuid } from "uuid";
import { env } from "../../env";
import { desa, event, generus, kelompok, log, presence, user } from "./schema";

const db = drizzle(env.DATABASE_URL);

async function main() {
	const desaData: InferInsertModel<typeof desa> = {
		nama: "Sendang Mulyo",
	};

	await db.insert(desa).values([
		desaData,
		{
			nama: "Kokosan",
		},
		{
			nama: "Kanguru",
		},
		{
			nama: "Graha Mukti",
		},
	]);

	const kelompokData: InferInsertModel<typeof kelompok> = {
		id: "SML",
		nama: "Sendang Mulyo",
		desa_id: 1,
	};

	await db.insert(kelompok).values([
		kelompokData,
		{
			id: "SRT",
			nama: "Sambiroto",
			desa_id: 1,
		},
		{
			id: "FTM",
			nama: "Fatmawati",
			desa_id: 1,
		},
		{
			id: "ZBR",
			nama: "Zebra",
			desa_id: 1,
		},
		{
			id: "KKS",
			nama: "Kokosan",
			desa_id: 2,
		},
		{
			id: "SGW",
			nama: "Sendang Guwo",
			desa_id: 2,
		},
		{
			id: "PSR",
			nama: "Pancur Sari",
			desa_id: 2,
		},
		{
			id: "LMP",
			nama: "Lamper Tengah",
			desa_id: 2,
		},
		{
			id: "KGR",
			nama: "Kanguru",
			desa_id: 3,
		},
		{
			id: "KRA",
			nama: "Karang Anyar",
			desa_id: 3,
		},
		{
			id: "PDS",
			nama: "Pandansari",
			desa_id: 3,
		},
		{
			id: "SRJ",
			nama: "Sambirejo",
			desa_id: 3,
		},
		{
			id: "MJG",
			nama: "Menjangan",
			desa_id: 4,
		},
		{
			id: "GRH",
			nama: "Graha Mukti",
			desa_id: 4,
		},
		{
			id: "GNS",
			nama: "Ganesha",
			desa_id: 4,
		},
		{
			id: "BGA",
			nama: "Banget Ayu",
			desa_id: 4,
		},
		{
			id: "BNK",
			nama: "Genuk Indah",
			desa_id: 4,
		},
		{
			id: "MKT",
			nama: "Muktiharjo",
			desa_id: 4,
		},
		{
			id: "SHD",
			nama: "Syuhada",
			desa_id: 4,
		},
	]);

	const generusData: InferInsertModel<typeof generus> = {
		nama: fakerID_ID.person.fullName(),
		jenis_kelamin: "Laki-laki",
		tempat_lahir: fakerID_ID.location.city(),
		tanggal_lahir: fakerID_ID.date.birthdate().toDateString(),
		jenjang: "Remaja",
		nomer_whatsapp: fakerID_ID.phone.number({ style: "international" }),
		pendidikan_terakhir: "SMA/SMK",
		nama_orang_tua: fakerID_ID.person.fullName(),
		nomer_whatsapp_orang_tua: fakerID_ID.phone.number({
			style: "international",
		}),
		sambung: "Aktif",
		alamat_tempat_tinggal: fakerID_ID.location.streetAddress(),
		keterangan: "Pendatang",
		alamat_asal: fakerID_ID.location.streetAddress(),
		kelompok_id: "SML",
	};

	await db.insert(generus).values([generusData]);

	const userData: InferInsertModel<typeof user> = {
		username: fakerID_ID.internet.email(),
		password: fakerID_ID.internet.password(),
		role: "User",
	};

	await db.insert(user).values([userData]);

	const logData: InferInsertModel<typeof log> = {
		event: "Login",
		description: "User login",
		user_id: userData.id,
	};

	await db.insert(log).values([logData]);

	const eventData: InferInsertModel<typeof event> = {
		title: fakerID_ID.lorem.sentence(),
		start_date: fakerID_ID.date.birthdate().toISOString(),
		end_date: fakerID_ID.date.birthdate().toISOString(),
		latitude: fakerID_ID.location.latitude(),
		longitude: fakerID_ID.location.longitude(),
		description: fakerID_ID.lorem.sentence(),
	};

	await db.insert(event).values([eventData]);

	const presenceData: InferInsertModel<typeof presence> = {
		status: "Hadir",
		generus_id: uuid(),
		event_id: uuid(),
	};

	await db.insert(presence).values([presenceData]);
}

main();
