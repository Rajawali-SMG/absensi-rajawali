"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateUser from "@/components/Sheet/Create/User";
import SheetUpdateUser from "@/components/Sheet/Update/User";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { UserSelect } from "@/types/user";
import { useAlert } from "@/utils/useAlert";

export default function PenggunaPage() {
	const searchParams = useSearchParams();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const { data, isPending } = api.user.getAllPaginated.useQuery({
		q: searchParams.get("q") || "",
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<UserSelect | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const queryClient = useQueryClient();
	const { setAlert } = useAlert();

	const mutation = api.user.deleteUser.useMutation({
		onError: (error) => {
			setAlert(error.message, "error");
		},
	});

	const handleEdit = (row: UserSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const handleDeleteConfirm = () => {
		mutation.mutate(
			{ id: deleteId },
			{
				onSuccess: (data) => {
					queryClient.invalidateQueries({ queryKey: ["userData"] });
					setAlert(data.message, "success");
				},
			},
		);
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: UserSelect) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns: ColumnDef<UserSelect>[] = [
		{
			accessorKey: "id",
		},
		{
			accessorKey: "username",
		},
		{
			accessorKey: "role",
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
				<SheetCreateUser closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateUser
					closeSheet={() => setSheetUpdate(false)}
					selectedData={selectedData}
				/>
			)}
			<div className="flex justify-between">
				<SearchBar
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Cari nama pengguna..."
				/>
				<Button type="button" onClick={() => setSheetCreate(true)}>
					Tambah Pengguna
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
