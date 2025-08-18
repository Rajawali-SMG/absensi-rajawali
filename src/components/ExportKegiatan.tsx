import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import { jenisKelaminOptions } from "@/constants/generus";
import { api } from "@/trpc/react";
import type { JenisKelaminType } from "@/types/generus";
import CustomSelect from "./CustomSelect";

export default function ExportKegiatan() {
	const [jenisKelaminParam, setJenisKelaminParam] =
		useState<JenisKelaminType>();
	const [kelompokIdParam, setKelompokIdParam] = useState("");
	const {
		data: kelompokData,
		isError: kelompokIsError,
		error: kelompokError,
		isLoading: kelompokIsLoading,
	} = api.kelompok.getAll.useQuery();
	// const { refetch } = api.event.getAll.useQuery(
	// 	{
	// 		kelompokId: kelompokIdParam
	// 	},
	// 	{
	// 		enabled: false,
	// 	},
	// );

	const test = api.presence.exportPresence.useQuery(
		{
			eventId: "17d456ed-38ed-4242-a7d5-ee333d73dbfc",
		},
		{
			enabled: false,
		},
	);
	const handleExport = async () => {
		setOpenModal(false);
		// const { data: generusData, isError, error } = await refetch();

		// if (isError) {
		// 	toast.error(error.message);
		// 	return;
		// }

		const worksheet = XLSX.utils.json_to_sheet(test?.data?.data || []);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Generus");
		XLSX.writeFile(workbook, "generus.xlsx");
		toast.success("Data Generus berhasil diexport");
		setJenisKelaminParam(undefined);
	};
	const [openModal, setOpenModal] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		if (kelompokIsError) {
			toast.error(kelompokError.message);
		}
		setIsClient(true);
	}, [kelompokIsError, kelompokError]);

	const kelompokOptions =
		kelompokData?.data.map((item) => ({
			value: item.id,
			label: item.nama,
			isDisabled: false,
		})) || [];

	if (!isClient) {
		return (
			<Button type="button" onClick={() => setOpenModal(true)}>
				Export
			</Button>
		);
	}

	return (
		<>
			<Button type="button" onClick={() => setOpenModal(true)}>
				Export
			</Button>
			<div
				className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300 ${openModal ? "translate-y-0" : "translate-y-full"}`}
			>
				<div className="bg-white p-4">
					<h2 className="text-xl font-bold">Export</h2>
					<div className="flex flex-col gap-y-2">
						<CustomSelect
							label="Kelompok"
							isLoading={kelompokIsLoading}
							options={kelompokOptions}
							placeholder="Pilih Kelompok"
							onChange={(e) => setKelompokIdParam(e?.value || "")}
							value={
								kelompokOptions.find(
									(option) => option.value === kelompokIdParam,
								) || null
							}
							isClearable
						/>
						<CustomSelect
							label="Jenis Kelamin"
							options={jenisKelaminOptions}
							placeholder="Pilih Jenis Kelamin"
							onChange={(e) =>
								setJenisKelaminParam(e?.value as JenisKelaminType)
							}
							value={
								jenisKelaminOptions.find(
									(option) => option.value === jenisKelaminParam,
								) || null
							}
							isClearable
						/>
						{/* <CustomSelect
							label="Jenjang"
							options={jenjangOptions}
							placeholder="Pilih Jenjang"
							onChange={(e) => setJenjangParam(e?.value as JenjangType)}
							value={
								jenjangOptions.find(
									(option) => option.value === jenjangParam,
								) || null
							}
							isClearable
						/>
						<CustomSelect
							label="Pendidikan Terakhir"
							options={pendidikanTerakhirOptions}
							placeholder="Pilih Pendidikan Terakhir"
							onChange={(e) =>
								setPendidikanTerakhirParam(e?.value as PendidikanTerakhirType)
							}
							value={
								pendidikanTerakhirOptions.find(
									(option) => option.value === pendidikanTerakhirParam,
								) || null
							}
							isClearable
						/>
						<CustomSelect
							label="Sambung"
							options={sambungOptions}
							placeholder="Pilih Sambung"
							onChange={(e) => setSambungParam(e?.value as SambungType)}
							value={
								sambungOptions.find(
									(option) => option.value === sambungParam,
								) || null
							}
							isClearable
						/>
						<CustomSelect
							label="Keterangan"
							options={keteranganOptions}
							placeholder="Pilih Keterangan"
							onChange={(e) => setKeteranganParam(e?.value as KeteranganType)}
							value={
								keteranganOptions.find(
									(option) => option.value === keteranganParam,
								) || null
							}
							isClearable
						/> */}
					</div>
					<div className="flex justify-end gap-x-2">
						<Button onClick={() => setOpenModal(false)}>Close</Button>
						<Button onClick={handleExport}>Export</Button>
					</div>
				</div>
			</div>
		</>
	);
}
