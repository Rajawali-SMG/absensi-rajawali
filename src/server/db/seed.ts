import { drizzle } from "drizzle-orm/postgres-js";
import { reset, seed } from "drizzle-seed";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env";
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
	const uuids: string[] = Array.from({ length: 19 }, () => uuidv4());
	const kelompok_code = [
		"SML",
		"SRT",
		"FTM",
		"ZBR",
		"KKS",
		"SGW",
		"PSR",
		"LMP",
		"KGR",
		"KRA",
		"PDS",
		"SRJ",
		"MJG",
		"GRH",
		"GNS",
		"BGA",
		"BNK",
		"MKT",
		"SHD",
	];
	await reset(db, {
		desa,
		kelompok,
		generus,
		log,
		presence,
		user,
		event,
		account,
		verification,
		session,
	});
	await seed(
		db,
		{
			desa,
			kelompok,
			generus,
			log,
			presence,
			event,
		},
		{ count: 25 },
	).refine((f) => ({
		desa: {
			columns: {
				nama: f.valuesFromArray({
					values: ["Sendang Mulyo", "Kokosan", "Kanguru", "Graha Mukti"],
				}),
			},
			count: 4,
		},
		kelompok: {
			columns: {
				id: f.valuesFromArray({
					values: uuids,
				}),
				nama: f.valuesFromArray({
					values: [
						"Sendang Mulyo",
						"Sambiroto",
						"Fatmawati",
						"Zebra",
						"Kokosan",
						"Sendang Guwo",
						"Pancur Sari",
						"Lamper Tengah",
						"Kanguru",
						"Karang Anyar",
						"Pandansari",
						"Sambirejo",
						"Menjangan",
						"Graha Mukti",
						"Ganesha",
						"Banget Ayu",
						"Genuk Indah",
						"Muktiharjo",
						"Syuhada",
					],
				}),
				code: f.valuesFromArray({
					values: kelompok_code,
				}),
				desaId: f.valuesFromArray({
					values: [1, 2, 3, 4],
				}),
			},
			count: 19,
		},
		generus: {
			columns: {
				id: f.uuid(),
				generusId: f.string({ isUnique: true }),
				nama: f.fullName(),
				tempatLahir: f.city(),
				nomerWhatsapp: f.phoneNumber({ template: "+628##########" }),
				namaOrangTua: f.fullName(),
				nomerWhatsappOrangTua: f.phoneNumber({
					template: "+628##########",
				}),
				alamatTempatTinggal: f.streetAddress(),
				alamatAsal: f.streetAddress(),
				kelompokId: f.valuesFromArray({
					values: uuids,
				}),
			},
		},
		log: {
			columns: {
				id: f.uuid(),
				event: f.valuesFromArray({
					values: ["Login", "Logout", "Register", "Update", "Delete"],
				}),
				description: f.loremIpsum(),
				userId: f.uuid(),
			},
		},
		event: {
			columns: {
				id: f.uuid(),
				description: f.loremIpsum(),
			},
		},
		presence: {
			columns: {
				id: f.uuid(),
				status: f.valuesFromArray({
					values: ["Hadir", "Izin", "Tidak Hadir"],
				}),
				generusId: f.uuid(),
				eventId: f.uuid(),
			},
		},
	}));
	await auth.api.signUpEmail({
		body: {
			name: "test",
			email: "test@test.com",
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
