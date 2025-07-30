import { hash } from "argon2";
import { drizzle } from "drizzle-orm/postgres-js";
import { reset, seed } from "drizzle-seed";
import { env } from "@/env";
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
	const hashedPassword = await hash(env.USER_PASSWORD);
	const db = drizzle(env.DATABASE_URL, { casing: "snake_case" });
	const kelompok_id = [
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
		session,
		verification,
	});
	await seed(
		db,
		{
			desa,
			kelompok,
			generus,
			log,
			presence,
			// user,
			event,
			// account,
			// session,
			// verification,
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
					values: kelompok_id,
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
				desaId: f.valuesFromArray({
					values: [1, 2, 3, 4],
				}),
			},
			count: 19,
		},
		generus: {
			columns: {
				id: f.uuid(),
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
					values: kelompok_id,
				}),
			},
		},
		// user: {
		// 	columns: {
		// 		id: f.uuid(),
		// 		name: f.default({ defaultValue: "admin" }),
		// 		email: f.default({ defaultValue: "admin@admin.com" }),
		// 		emailVerified: f.default({ defaultValue: true }),
		// 		password: f.default({ defaultValue: hashedPassword }),
		// 		role: f.default({ defaultValue: "Super Admin" }),
		// 	},
		// 	count: 1,
		// },
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
		// account: {
		// 	columns: {
		// 		id: f.uuid(),
		// 		account_id: f.uuid(),
		// 		provider_id: f.uuid(),
		// 		user_id: f.uuid(),
		// 		id_token: f.uuid(),
		// 		access_token_expires_at: f.timestamp(),
		// 		refresh_token_expires_at: f.timestamp(),
		// 		password: f.default({ defaultValue: hashedPassword }),
		// 		created_at: f.timestamp(),
		// 		updated_at: f.timestamp(),
		// 	},
		// },
		// session: {
		// 	columns: {
		// 		id: f.uuid(),
		// 		expires_at: f.timestamp(),
		// 		created_at: f.timestamp(),
		// 		updated_at: f.timestamp(),
		// 		user_id: f.uuid(),
		// 	},
		// },
		// verification: {
		// 	columns: {
		// 		id: f.uuid(),
		// 		expires_at: f.timestamp(),
		// 	},
		// },
	}));
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
