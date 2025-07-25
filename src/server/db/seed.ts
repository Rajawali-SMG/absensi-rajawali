import { drizzle } from "drizzle-orm/postgres-js";
import { reset, seed } from "drizzle-seed";
import { env } from "../../env";
import { desa, event, generus, kelompok, log, presence, user } from "./schema";

async function main() {
	const db = drizzle(env.DATABASE_URL);
	await reset(db, { desa, kelompok, generus, log, presence, user, event });
	await seed(db, {
		desa,
		kelompok,
		generus,
		log,
		presence,
		user,
		event,
	}).refine((f) => ({
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
					values: [
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
					],
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
				desa_id: f.valuesFromArray({
					values: [1, 2, 3, 4],
				}),
			},
			count: 19,
		},
		generus: {
			columns: {
				id: f.uuid(),
				nama: f.fullName(),
				tempat_lahir: f.city(),
				nomer_whatsapp: f.phoneNumber({ template: "+628##########" }),
				nama_orang_tua: f.fullName(),
				nomer_whatsapp_orang_tua: f.phoneNumber({ template: "+628##########" }),
				alamat_tempat_tinggal: f.streetAddress(),
				alamat_asal: f.streetAddress(),
				kelompok_id: f.valuesFromArray({
					values: [
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
					],
				}),
			},
		},
		user: {
			columns: {
				id: f.uuid(),
			},
		},
		log: {
			columns: {
				id: f.uuid(),
				event: f.valuesFromArray({
					values: ["Login", "Logout", "Register", "Update", "Delete"],
				}),
				description: f.loremIpsum(),
				user_id: f.uuid(),
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
				generus_id: f.uuid(),
				event_id: f.uuid(),
			},
		},
	}));
}
main();
