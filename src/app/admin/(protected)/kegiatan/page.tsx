"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateEvent from "@/components/Sheet/Create/Event";
import SheetUpdateEvent from "@/components/Sheet/Update/Event";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { EventSelect } from "@/types/event";
import { useAlert } from "@/utils/useAlert";

export default function KegiatanPage() {
	const navigate = useRouter();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending } = api.event.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<EventSelect | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const { setAlert } = useAlert();
	const utils = api.useUtils();

	const mutation = api.event.deleteEvent.useMutation({
		onError: (error) => {
			setAlert(error.message, "error");
		},
	});

	const handleEdit = (row: EventSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const handleDeleteConfirm = () => {
		mutation.mutate(
			{ id: deleteId },
			{
				onSuccess: (data) => {
					utils.event.getAllPaginated.invalidate();
					setAlert(data.message, "success");
				},
			},
		);
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
			accessorKey: "start_date",
			header: "Tanggal Mulai",
		},
		{
			accessorKey: "end_date",
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
			id: "aksi",
			header: "Aksi",
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<button type="button" onClick={() => handleEdit(row)}>
							<Icon
								icon="line-md:edit"
								fontSize={20}
								className="text-blue-500"
							/>
						</button>
						<button type="button" onClick={() => handleDelete(row)}>
							<Icon
								icon="mynaui:trash"
								fontSize={20}
								className="text-red-500"
							/>
						</button>
					</div>
				);
			},
		},
	];

	return (
		<>
			{dialog && (
				<Dialog
					cancel="Batal"
					confirm="Hapus"
					title="Apakah Anda yakin ingin menghapus data ini?"
					handleCancel={() => setDialog(false)}
					handleConfirm={handleDeleteConfirm}
					description="Tindakan ini tidak dapat dibatalkan."
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
				<Button type="button" onClick={() => setSheetCreate(true)}>
					Tambah Kegiatan
				</Button>
			</div>
			<Table
				isPending={isPending}
				data={data?.data?.items || []}
				columns={columns}
				rowCount={data?.data?.meta?.total || 0}
				onPaginationChange={setPagination}
				pagination={pagination}
			/>
		</>
	);
}
