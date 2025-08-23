"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { api } from "../trpc/react";
import type { GenerusUploadRow } from "../types/generus";
import Button from "./ui/Button";

export default function UploadExcelDialog() {
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const { mutate } = api.generus.uploadGenerus.useMutation({
		onError: ({ message }) => {
			toast.dismiss();
			toast.error(message);
		},
		onMutate: () => {
			toast.loading("Loading...");
		},
		onSuccess: ({ message }) => {
			toast.dismiss();
			toast.success(message);
			setOpen(false);
		},
	});

	const handleUpload = async () => {
		if (!file) return;

		const data = await file.arrayBuffer();
		const workbook = XLSX.read(data, { type: "array" });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName!];
		const json = XLSX.utils.sheet_to_json<GenerusUploadRow>(worksheet!, {
			raw: false,
		});
		const processedJson = json.map((row) => ({
			...row,
			nomerWhatsapp: row.nomerWhatsapp ? String(row.nomerWhatsapp) : "",
			nomerWhatsappOrangTua: row.nomerWhatsappOrangTua
				? String(row.nomerWhatsappOrangTua)
				: "",
		}));

		mutate(processedJson);
	};

	const handleDownloadTemplate = () => {
		const ws = XLSX.utils.json_to_sheet([
			// biome-ignore assist/source/useSortedKeys: Template excel
			{
				nama: "Abdul Rahman",
				jenisKelamin: "Laki-laki",
				tempatLahir: "Yogyakarta",
				tanggalLahir: "2006-01-01",
				jenjang: "Paud",
				nomerWhatsapp: "628123456789",
				pendidikanTerakhir: "SD",
				namaOrangTua: "Orang Tua",
				nomerWhatsappOrangTua: "628123456789",
				sambung: "Aktif",
				alamatTempatTinggal:
					"Jl. Kanguru Utara VII, Gayamsari, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50248",
				keterangan: "Pendatang",
				alamatAsal:
					"Jl. HOS. Cokroaminoto No.195, RT.002/RW.007, Burengan, Kec. Pesantren, Kabupaten Kediri, Jawa Timur 64131",
				code: "KGR",
			},
		]);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Template");
		XLSX.writeFile(wb, "generus_template.xlsx");
	};

	return (
		<div>
			{/* Trigger Button */}
			<Button onClick={() => setOpen(true)} type="button">
				Upload Excel
			</Button>

			{/* Dialog */}
			{open && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
						{/* Close Button */}
						<Button
							className="absolute top-2 right-2 text-gray-500 hover:text-black"
							onClick={() => setOpen(false)}
							type="button"
						>
							✕
						</Button>

						<h2 className="font-bold mb-4">Upload Data Generus</h2>

						{/* Download Template */}
						<Button
							className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded mb-4"
							onClick={handleDownloadTemplate}
						>
							Download Template XLSX
						</Button>

						{/* File Input */}
						<input
							accept=".xlsx,.xls"
							className="w-full border rounded p-2 mb-4"
							onChange={(e) => setFile(e.target.files?.[0] || null)}
							type="file"
						/>

						<div className="mt-4 flex justify-end">
							<Button disabled={!file} onClick={handleUpload} variant="primary">
								Upload
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
