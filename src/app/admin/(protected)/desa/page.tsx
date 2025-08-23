"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateDesa from "@/components/Sheet/Create/Desa";
import SheetUpdateDesa from "@/components/Sheet/Update/Desa";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { DesaSelect } from "@/types/desa";
import useToastError from "@/utils/useToastError";

export default function DesaPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending, error } = api.desa.getAllPaginated.useQuery({
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		q: searchQuery,
	});
	const [dialog, setDialog] = useState(false);
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<DesaSelect | null>(null);
	const [deleteId, setDeleteId] = useState("");
	const { mutate } = api.desa.deleteDesa.useMutation({
		onError: (error) => {
			toast.dismiss();
			toast.error(error.message);
		},
		onMutate() {
			toast.loading("Menghapus desa");
		},
		onSuccess: ({ message }) => {
			utils.desa.invalidate();
			toast.dismiss();
			toast.success(message);
		},
	});
	const utils = api.useUtils();
	const handleDeleteConfirm = () => {
		mutate({ id: deleteId });
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: DesaSelect) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const handleEdit = (row: DesaSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const columns: ColumnDef<DesaSelect>[] = [
		{
			accessorKey: "id",
		},
		{
			accessorKey: "nama",
		},
		{
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
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
				<SheetCreateDesa closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateDesa
					closeSheet={() => setSheetUpdate(false)}
					selectedData={selectedData}
				/>
			)}
			<div className="flex justify-between">
				<SearchBar
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Cari Nama Desa..."
				/>
				<Button onClick={() => setSheetCreate(true)} type="button">
					Tambah Desa
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
