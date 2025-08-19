import { faker } from "@faker-js/faker/locale/id_ID";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/env";
import type { DesaInsert } from "@/types/desa";
import type { EventInsert } from "@/types/event";
import type { GenerusInsert } from "@/types/generus";
import type { KelompokInsert } from "@/types/kelompok";
import { auth } from "../auth";
import {
	account,
	desa,
	event,
	generus,
	kelompok,
	log,
	presence,
	session,
	user,
	verification,
} from "./schema";

async function main() {
	console.log("Seeding started⏳");
	const db = drizzle(env.DATABASE_URL, { casing: "snake_case" });

	await db.delete(desa);
	const desaData: DesaInsert[] = [
		{
			nama: "Sendang Mulyo",
		},
		{
			nama: "Kokosan",
		},
		{
			nama: "Kanguru",
		},
		{
			nama: "Graha Mukti",
		},
	];
	await db.insert(desa).values(desaData);

	const desaIds = await db.select({ id: desa.id }).from(desa);
	await db.delete(kelompok);
	const kelompokData: KelompokInsert[] = [
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Sendang Mulyo",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Sambiroto",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Fatmawati",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Zebra",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Kokosan",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Sendang Guwo",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Pancur Sari",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Lamper Tengah",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Kanguru",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Karang Anyar",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Pandansari",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Sambirejo",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Menjangan",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Graha Mukti",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Ganesha",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Banget Ayu",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Genuk Indah",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Muktiharjo",
		},
		{
			desaId: faker.helpers.arrayElement(desaIds.map((d) => d.id)),
			id: faker.string.uuid(),
			nama: "Syuhada",
		},
	];
	await db.insert(kelompok).values(kelompokData);

	const kelompokIds = await db.select({ id: kelompok.id }).from(kelompok);

	await db.delete(generus);
	const generusData: GenerusInsert[] = [];
	for (let i = 1; i <= 25; i++) {
		generusData.push({
			alamatAsal: faker.location.streetAddress(),
			alamatTempatTinggal: faker.location.streetAddress(),
			jenisKelamin: faker.helpers.arrayElement(["Laki-laki", "Perempuan"]),
			jenjang: faker.helpers.arrayElement([
				"Paud",
				"Caberawit",
				"Pra Remaja",
				"Remaja",
				"Pra Nikah",
				"Remaja",
				"Pra Nikah",
			]),
			kelompokId: faker.helpers.arrayElement(
				kelompokIds.map((k) => k.id) ?? [],
			),
			keterangan: faker.helpers.arrayElement(["Pendatang", "Pribumi"]),
			nama: faker.person.fullName(),
			namaOrangTua: faker.person.fullName(),
			nomerWhatsapp: faker.phone.number({ style: "international" }),
			nomerWhatsappOrangTua: faker.phone.number({ style: "international" }),
			pendidikanTerakhir: faker.helpers.arrayElement([
				"PAUD",
				"TK",
				"SD",
				"SMP",
				"SMA/SMK",
				"D1-D3",
				"S1/D4",
				"S2",
				"S3",
			]),
			sambung: faker.helpers.arrayElement(["Aktif", "Tidak Aktif"]),
			tanggalLahir: faker.date.birthdate().toDateString(),
			tempatLahir: faker.location.city(),
		});
	}
	await db.insert(generus).values(generusData);

	await db.delete(event);
	const eventData: EventInsert[] = [];
	for (let i = 1; i <= 25; i++) {
		const title = `${faker.food.spice()} - ${faker.string.alphanumeric(6)}`;
		eventData.push({
			description: faker.lorem.sentence({ max: 5, min: 1 }),
			endDate: faker.date.future().toISOString(),
			latitude: faker.location.latitude({ precision: 1 }),
			longitude: faker.location.longitude({ precision: 1 }),
			startDate: faker.date.past().toISOString(),
			title,
		});
	}
	await db.insert(event).values(eventData);

	await db.delete(log);
	await db.delete(presence);
	await db.delete(session);
	await db.delete(user);
	await db.delete(verification);
	await db.delete(account);
	await db.delete(session);

	await auth.api.signUpEmail({
		body: {
			email: "test@test.com",
			name: "test",
			password: env.USER_PASSWORD,
			role: "Super Admin",
		},
	});
}
main()
	.catch((error) => {
		console.log(`There was an Error❌: ${error}`);
		process.exit(1);
	})
	.then(() => {
		console.log("Seeding success✅");
		process.exit(0);
	});
