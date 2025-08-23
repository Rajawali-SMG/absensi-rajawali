"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Dialog from "@/components/Dialog";
import ExportKegiatan from "@/components/ExportKegiatan";
import SearchBar from "@/components/SearchBar";
import SheetCreateEvent from "@/components/Sheet/Create/Event";
import SheetUpdateEvent from "@/components/Sheet/Update/Event";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { EventSelect } from "@/types/event";
import useToastError from "@/utils/useToastError";

export default function KegiatanPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending, error } = api.event.getAllPaginated.useQuery({
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		q: searchQuery,
	});
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<EventSelect | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const utils = api.useUtils();

	const { mutate } = api.event.deleteEvent.useMutation({
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
			utils.event.invalidate();
		},
	});

	const handleEdit = (row: EventSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const handleDeleteConfirm = () => {
		mutate({ id: deleteId });
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: EventSelect) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns: ColumnDef<EventSelect>[] = [
		{
			accessorKey: "id",
		},
		{
			accessorKey: "title",
			header: "Judul",
		},
		{
			accessorKey: "startDate",
			header: "Tanggal Mulai",
		},
		{
			accessorKey: "endDate",
			header: "Tanggal Selesai",
		},
		{
			accessorKey: "latitude",
			header: "Latitude",
		},
		{
			accessorKey: "longitude",
			header: "Longitude",
		},
		{
			accessorKey: "description",
			header: "Deskripsi",
		},
		{
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<Link href={`/qr/${row.id}`} target="_blank">
							<Icon className="text-blue-500" fontSize={20} icon="bx:qr" />
						</Link>
						<button onClick={() => handleEdit(row)} type="button">
							<Icon
								className="text-blue-500"
								fontSize={20}
								icon="line-md:edit"
							/>
						</button>
						<button onClick={() => handleDelete(row)} type="button">
							<Icon
								className="text-red-500"
								fontSize={20}
								icon="mynaui:trash"
							/>
						</button>
					</div>
				);
			},
			header: "Aksi",
			id: "aksi",
		},
	];

	useToastError(error);

	return (
		<>
			{dialog && (
				<Dialog
					cancel="Batal"
					confirm="Hapus"
					description="Tindakan ini tidak dapat dibatalkan."
					handleCancel={() => setDialog(false)}
					handleConfirm={handleDeleteConfirm}
					title="Apakah Anda yakin ingin menghapus data ini?"
				/>
			)}
			{sheetCreate && (
				<SheetCreateEvent closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateEvent
					closeSheet={() => setSheetUpdate(false)}
					selectedData={selectedData}
				/>
			)}
			<div className="flex justify-between">
				<SearchBar
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Cari Kegiatan..."
				/>
				<ExportKegiatan />
				<Button onClick={() => setSheetCreate(true)} type="button">
					Tambah Kegiatan
				</Button>
			</div>
			<Table
				columns={columns}
				data={data?.data.items || []}
				isPending={isPending}
				onPaginationChange={setPagination}
				pagination={pagination}
				rowCount={data?.data.meta.total || 0}
			/>
		</>
	);
}
