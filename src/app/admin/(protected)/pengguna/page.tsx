"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateUser from "@/components/Sheet/Create/User";
import SheetUpdateUser from "@/components/Sheet/Update/User";
import SheetUpdateUserPassword from "@/components/Sheet/Update/UserPassword";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { UserSelect } from "@/types/user";
import useToastError from "@/utils/useToastError";

export default function PenggunaPage() {
	const searchParams = useSearchParams();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const { data, isPending, error } = api.user.getAllPaginated.useQuery({
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		q: searchParams.get("q") || "",
	});
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [sheetUpdatePassword, setSheetUpdatePassword] = useState(false);
	const [selectedData, setSelectedData] = useState<UserSelect | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const utils = api.useUtils();

	const {
		mutateAsync,
		data: deleteData,
		error: deleteError,
	} = api.user.deleteUser.useMutation({
		onSuccess: () => {
			utils.user.getAllPaginated.invalidate();
		},
	});

	const handleChangeUser = (row: UserSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const handleChangePassword = (row: UserSelect) => {
		setSelectedData(row);
		setSheetUpdatePassword(true);
	};

	const handleDeleteConfirm = () => {
		toast.promise(mutateAsync({ id: deleteId }), {
			error: deleteError?.message,
			loading: "Loading...",
			success: deleteData?.message,
		});
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
			accessorKey: "name",
		},
		{
			accessorKey: "email",
		},
		{
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<button onClick={() => handleChangeUser(row)} type="button">
							<Icon
								className="text-blue-500"
								fontSize={20}
								icon="material-symbols:person-outline-rounded"
							/>
						</button>
						<button onClick={() => handleChangePassword(row)} type="button">
							<Icon
								className="text-orange-500"
								fontSize={20}
								icon="material-symbols:password-rounded"
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
				<SheetCreateUser closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateUser
					closeSheet={() => setSheetUpdate(false)}
					selectedData={selectedData}
				/>
			)}
			{sheetUpdatePassword && selectedData && (
				<SheetUpdateUserPassword
					closeSheet={() => setSheetUpdatePassword(false)}
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
				<Button onClick={() => setSheetCreate(true)} type="button">
					Tambah Pengguna
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
