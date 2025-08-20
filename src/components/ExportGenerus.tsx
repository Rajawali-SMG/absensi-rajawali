import { useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import {
	jenisKelaminOptions,
	jenjangOptions,
	keteranganOptions,
	pendidikanTerakhirOptions,
	sambungOptions,
} from "@/constants/generus";
import { api } from "@/trpc/react";
import type {
	JenisKelaminType,
	JenjangType,
	KeteranganType,
	PendidikanTerakhirType,
	SambungType,
} from "@/types/generus";
import useToastError from "../utils/useToastError";
import CustomSelect from "./CustomSelect";

export default function ExportGenerus() {
	const [jenisKelaminParam, setJenisKelaminParam] =
		useState<JenisKelaminType>();
	const [jenjangParam, setJenjangParam] = useState<JenjangType>();
	const [pendidikanTerakhirParam, setPendidikanTerakhirParam] =
		useState<PendidikanTerakhirType>();
	const [sambungParam, setSambungParam] = useState<SambungType>();
	const [keteranganParam, setKeteranganParam] = useState<KeteranganType>();
	const [kelompokIdParam, setKelompokIdParam] = useState("");
	const {
		data: kelompokData,
		error: kelompokError,
		isLoading: kelompokIsLoading,
	} = api.kelompok.getAll.useQuery();
	const { refetch } = api.generus.getAll.useQuery(
		{
			jenisKelamin: jenisKelaminParam,
			jenjang: jenjangParam,
			kelompokId: kelompokIdParam,
			keterangan: keteranganParam,
			pendidikanTerakhir: pendidikanTerakhirParam,
			sambung: sambungParam,
		},
		{
			enabled: false,
		},
	);
	const handleExport = async () => {
		setOpenModal(false);
		const { data: generusData, isError, error } = await refetch();

		if (isError) {
			toast.error(error.message);
			return;
		}

		const worksheet = XLSX.utils.json_to_sheet(generusData?.data || []);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Generus");
		XLSX.writeFile(workbook, "generus.xlsx");
		toast.success("Data Generus berhasil diexport");
		setJenisKelaminParam(undefined);
		setJenjangParam(undefined);
		setKelompokIdParam("");
		setKeteranganParam(undefined);
		setPendidikanTerakhirParam(undefined);
		setSambungParam(undefined);
	};
	const [openModal, setOpenModal] = useState(false);

	useToastError(kelompokError);

	const kelompokOptions =
		kelompokData?.data.map((item) => ({
			isDisabled: false,
			label: item.nama,
			value: item.id,
		})) || [];

	return (
		<>
			<Button onClick={() => setOpenModal(true)} type="button">
				Export
			</Button>
			<div
				className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300 ${openModal ? "translate-y-0" : "translate-y-full"}`}
			>
				<div className="bg-white p-4">
					<h2 className="font-bold">Export</h2>
					<div className="flex flex-col gap-y-2">
						<CustomSelect
							isLoading={kelompokIsLoading}
							label="Kelompok"
							onChange={(e) => setKelompokIdParam(e?.value || "")}
							options={kelompokOptions}
							placeholder="Pilih Kelompok"
							value={
								kelompokOptions.find(
									(option) => option.value === kelompokIdParam,
								) || null
							}
						/>
						<CustomSelect
							label="Jenis Kelamin"
							onChange={(e) =>
								setJenisKelaminParam(e?.value as JenisKelaminType)
							}
							options={jenisKelaminOptions}
							placeholder="Pilih Jenis Kelamin"
							value={
								jenisKelaminOptions.find(
									(option) => option.value === jenisKelaminParam,
								) || null
							}
						/>
						<CustomSelect
							label="Jenjang"
							onChange={(e) => setJenjangParam(e?.value as JenjangType)}
							options={jenjangOptions}
							placeholder="Pilih Jenjang"
							value={
								jenjangOptions.find(
									(option) => option.value === jenjangParam,
								) || null
							}
						/>
						<CustomSelect
							label="Pendidikan Terakhir"
							onChange={(e) =>
								setPendidikanTerakhirParam(e?.value as PendidikanTerakhirType)
							}
							options={pendidikanTerakhirOptions}
							placeholder="Pilih Pendidikan Terakhir"
							value={
								pendidikanTerakhirOptions.find(
									(option) => option.value === pendidikanTerakhirParam,
								) || null
							}
						/>
						<CustomSelect
							label="Sambung"
							onChange={(e) => setSambungParam(e?.value as SambungType)}
							options={sambungOptions}
							placeholder="Pilih Sambung"
							value={
								sambungOptions.find(
									(option) => option.value === sambungParam,
								) || null
							}
						/>
						<CustomSelect
							label="Keterangan"
							onChange={(e) => setKeteranganParam(e?.value as KeteranganType)}
							options={keteranganOptions}
							placeholder="Pilih Keterangan"
							value={
								keteranganOptions.find(
									(option) => option.value === keteranganParam,
								) || null
							}
						/>
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
