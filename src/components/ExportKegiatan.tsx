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

		const worksheet = XLSX.utils.json_to_sheet(presenceData?.data || []);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Presence");
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
			value: item.id,
			label: item.nama,
		})) || [];

	const eventOptions =
		eventData?.data.map((item) => ({
			value: item.id,
			label: item.title,
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
						/>
						<CustomSelect
							label="Event"
							isLoading={kelompokIsLoading}
							options={eventOptions}
							placeholder="Pilih Event"
							onChange={(e) => setEventIdParam(e?.value || "")}
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
