"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { api } from "../trpc/react";

export default function UploadExcelDialog() {
	const [open, setOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const uploadMutation = api.generus.uploadGenerus.useMutation();

	const handleUpload = async () => {
		if (!file) return;

		const data = await file.arrayBuffer();
		const workbook = XLSX.read(data, { type: "array" });
		const sheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[sheetName];
		const json = XLSX.utils.sheet_to_json(worksheet);

		uploadMutation.mutate(json as any);
	};

	const handleDownloadTemplate = () => {
		const ws = XLSX.utils.json_to_sheet([
			{
				nama: "Abdul Rahman",
				jenisKelamin: "Laki-laki",
				tempatLahir: "Yogyakarta",
				tanggalLahir: "2006-01-01",
				jenjang: "Paud",
				nomerWhatsapp: "+628123456789",
				pendidikanTerakhir: "SD",
				namaOrangTua: "Orang Tua",
				nomerWhatsappOrangTua: "+628123456789",
				sambung: "Sambung",
				alamatTempatTinggal:
					"Jl. Kanguru Utara VII, Gayamsari, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50248",
				keterangan: "Aktif",
				alamatAsal:
					"Jl. Kanguru Utara VII, Gayamsari, Kec. Gayamsari, Kota Semarang, Jawa Tengah 50248",
				kelompokId: "1",
			},
		]);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Template");
		XLSX.writeFile(wb, "generus_template.xlsx");
	};

	return (
		<div>
			{/* Trigger Button */}
			<button
				onClick={() => setOpen(true)}
				className="px-4 py-2 bg-blue-600 text-white rounded"
			>
				Upload Excel
			</button>

			{/* Dialog */}
			{open && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
						{/* Close Button */}
						<button
							onClick={() => setOpen(false)}
							className="absolute top-2 right-2 text-gray-500 hover:text-black"
						>
							✕
						</button>

						<h2 className="text-lg font-bold mb-4">Upload Data Generus</h2>

						{/* Download Template */}
						<button
							onClick={handleDownloadTemplate}
							className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded mb-4"
						>
							Download Template XLSX
						</button>

						{/* File Input */}
						<input
							type="file"
							accept=".xlsx,.xls"
							onChange={(e) => setFile(e.target.files?.[0] || null)}
							className="w-full border rounded p-2 mb-4"
						/>

						{/* Status Messages */}
						{uploadMutation.isLoading && (
							<p className="text-sm text-gray-500">Uploading...</p>
						)}
						{uploadMutation.isSuccess && (
							<p className="text-sm text-green-600">
								✅ Upload sukses {uploadMutation.data?.count} baris!
							</p>
						)}
						{uploadMutation.isError && (
							<p className="text-sm text-red-600">❌ Upload gagal</p>
						)}

						{/* Upload Button */}
						<div className="mt-4 flex justify-end">
							<button
								onClick={handleUpload}
								disabled={!file || uploadMutation.isLoading}
								className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
							>
								Upload
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
