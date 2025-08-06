"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateDesa from "@/components/Sheet/Create/Desa";
import SheetUpdateDesa from "@/components/Sheet/Update/Desa";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { DesaSelect } from "@/types/desa";

export default function DesaPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending, isError, error } = api.desa.getAllPaginated.useQuery(
		{
			q: searchQuery,
			limit: pagination.pageSize,
			page: pagination.pageIndex,
		},
	);
	const [dialog, setDialog] = useState(false);
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<DesaSelect | null>(null);
	const [deleteId, setDeleteId] = useState<number>(0);
	const mutation = api.desa.deleteDesa.useMutation({
		onError: (error) => {
			toast.error(error.message);
		},
	});
	const utils = api.useUtils();
	const handleDeleteConfirm = () => {
		mutation.mutate(
			{ id: deleteId },
			{
				onSuccess: (data) => {
					utils.desa.getAllPaginated.invalidate();
					toast.success(data.message);
				},
			},
		);
		setDialog(false);
		setDeleteId(0);
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

	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError]);

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
					placeholder="Cari Nama Desa..."
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				/>
				<Button type="button" onClick={() => setSheetCreate(true)}>
					Tambah Desa
				</Button>
			</div>
			<Table
				isPending={isPending}
				data={data?.data.items || []}
				columns={columns}
				rowCount={data?.data.meta.total || 0}
				onPaginationChange={setPagination}
				pagination={pagination}
			/>
		</>
	);
}
