import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import Button from "@/components/ui/Button";
import { api } from "@/trpc/react";
import CustomSelect from "./CustomSelect";

export default function ExportKegiatan() {
	const [kelompokIdParam, setKelompokIdParam] = useState("");
	const [eventIdParam, setEventIdParam] = useState("");
	const {
		data: kelompokData,
		isError: kelompokIsError,
		error: kelompokError,
		isLoading: kelompokIsLoading,
	} = api.kelompok.getAll.useQuery();

	const { refetch } = api.presence.exportPresence.useQuery(
		{
			eventId: eventIdParam,
			kelompokId: kelompokIdParam,
		},
		{
			enabled: false,
		},
	);
	const { data: eventData } = api.event.getAll.useQuery();
	const handleExport = async () => {
		setOpenModal(false);
		const { data: presenceData, isError, error } = await refetch();

		if (isError) {
			toast.error(error.message);
			return;
		}

		const total = presenceData?.data.data.length || 0;
		const hadirCount = presenceData?.data.hadir || 0;
		const izinCount = presenceData?.data.izin || 0;
		const tidakHadirCount = total - hadirCount - izinCount;

		const rows = [
			{
				Count: hadirCount,
				Percentage: total
					? `${((hadirCount / total) * 100).toFixed(2)}%`
					: "0%",
				Rekap: "Hadir",
			},
			{
				Count: izinCount,
				Percentage: total ? `${((izinCount / total) * 100).toFixed(2)}%` : "0%",
				Rekap: "Izin",
			},
			{
				Count: tidakHadirCount,
				Percentage: total
					? `${((tidakHadirCount / total) * 100).toFixed(2)}%`
					: "0%",
				Rekap: "Tidak Hadir",
			},
			{
				Count: total,
				Rekap: "Total",
			},
		];

		const worksheetData = XLSX.utils.json_to_sheet(
			presenceData?.data.data || [],
		);
		const worksheetTotal = XLSX.utils.json_to_sheet(rows);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheetData, "Data");
		XLSX.utils.book_append_sheet(workbook, worksheetTotal, "Total");
		XLSX.writeFile(
			workbook,
			`${eventData?.data.find((item) => item.id === eventIdParam)?.title}.xlsx`,
		);
		toast.success("Data Presence berhasil diexport");
		setKelompokIdParam("");
		setEventIdParam("");
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
			label: item.nama,
			value: item.id,
		})) || [];

	const eventOptions =
		eventData?.data.map((item) => ({
			label: item.title,
			value: item.id,
		})) || [];

	if (!isClient) {
		return (
			<Button onClick={() => setOpenModal(true)} type="button">
				Export
			</Button>
		);
	}

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
							isLoading={kelompokIsLoading}
							label="Event"
							onChange={(e) => setEventIdParam(e?.value || "")}
							options={eventOptions}
							placeholder="Pilih Event"
							value={
								eventOptions.find((option) => option.value === eventIdParam) ||
								null
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
