"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function PenggunaPage() {
	const searchParams = useSearchParams();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const { data, isPending, error, isError } = api.user.getAllPaginated.useQuery(
		{
			q: searchParams.get("q") || "",
			limit: pagination.pageSize,
			page: pagination.pageIndex,
		},
	);
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [sheetUpdatePassword, setSheetUpdatePassword] = useState(false);
	const [selectedData, setSelectedData] = useState<UserSelect | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const utils = api.useUtils();

	const mutation = api.user.deleteUser.useMutation({
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: (data) => {
			utils.user.getAllPaginated.invalidate();
			toast.success(data.message);
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
		mutation.mutate({ id: deleteId });
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
			id: "aksi",
			header: "Aksi",
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<button type="button" onClick={() => handleChangeUser(row)}>
							<Icon
								icon="material-symbols:person-outline-rounded"
								fontSize={20}
								className="text-blue-500"
							/>
						</button>
						<button type="button" onClick={() => handleChangePassword(row)}>
							<Icon
								icon="material-symbols:password-rounded"
								fontSize={20}
								className="text-orange-500"
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
	}, [isError, error]);

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
