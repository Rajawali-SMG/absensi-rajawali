export const jenisKelaminOptions = [
	{ value: "Laki_Laki", label: "Laki-Laki" },
	{ value: "Perempuan", label: "Perempuan" },
];

export const jenjangOptions = [
	{ value: "Paud", label: "Paud" },
	{ value: "Caberawit", label: "Caberawit" },
	{ value: "Pra_Remaja", label: "Pra Remaja" },
	{ value: "Remaja", label: "Remaja" },
	{ value: "Pra_Nikah", label: "Pra Nikah" },
];

export const pendidikanTerakhirOptions = [
	{ value: "PAUD", label: "PAUD" },
	{ value: "TK", label: "TK" },
	{ value: "SD", label: "SD" },
	{ value: "SMP", label: "SMP" },
	{ value: "SMA_SMK", label: "SMA/SMK" },
	{ value: "D1_D3", label: "D1-D3" },
	{ value: "S1_D4", label: "S1/D4" },
	{ value: "S2", label: "S2" },
	{ value: "S3", label: "S3" },
];

export const roleOptions = [
	{ value: "Admin", label: "Admin" },
	{ value: "User", label: "User" },
];

export const sambungOptions = [
	{ value: "Aktif", label: "Aktif" },
	{ value: "Tidak_Aktif", label: "Tidak Aktif" },
];

export const keteranganOptions = [
	{ value: "Pendatang", label: "Pendatang" },
	{ value: "Pribumi", label: "Pribumi" },
];

export const filterOptions = [
	{
		value: "jenis_kelamin",
		label: "Jenis Kelamin",
		options: jenisKelaminOptions,
	},
	{ value: "jenjang", label: "Jenjang", options: jenjangOptions },
	{
		value: "pendidikan_terakhir",
		label: "Pendidikan Terakhir",
		options: pendidikanTerakhirOptions,
	},
	{ value: "sambung", label: "Sambung", options: sambungOptions },
	{ value: "keterangan", label: "Keterangan", options: keteranganOptions },
];

export const kelompokOptions = [
	{ value: "Kanguru", label: "Kanguru" },
	{ value: "Gajah", label: "Gajah" },
];
