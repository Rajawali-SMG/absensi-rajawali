"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateUser from "@/components/Sheet/Create/User";
import SheetUpdateUser from "@/components/Sheet/Update/User";
import SheetFilter from "@/components/SheetFilter";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import { roleOptions } from "@/constants";
import { api } from "@/trpc/react";
import type { RoleType, UserSelect } from "@/types/user";
import { useAlert } from "@/utils/useAlert";

export default function PenggunaPage() {
	const [sheetFilter, setSheetFilter] = useState(false);
	const [roleParam, setRoleParam] = useState<RoleType>();
	const searchParams = useSearchParams();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const { data, isPending } = api.user.getAllPaginated.useQuery({
		q: searchParams.get("q") || "",
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		role: roleParam,
	});
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<UserSelect | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const utils = api.useUtils();
	const { setAlert } = useAlert();

	const mutation = api.user.deleteUser.useMutation({
		onError: (error) => {
			setAlert(error.message, "error");
		},
		onSuccess: (data) => {
			utils.user.getAllPaginated.invalidate();
			setAlert(data.message, "success");
		},
	});

	const handleEdit = (row: UserSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
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
			{sheetFilter && (
				<SheetFilter
					closeSheet={() => setSheetFilter(false)}
					submitFilter={() => setSheetFilter(false)}
					resetFilter={() => {
						setRoleParam(undefined);
						setSheetFilter(false);
					}}
				>
					<Select
						placeHolderEnabled={true}
						name="role"
						label="Role"
						options={roleOptions}
						placeholder="Pilih Role"
						value={roleParam}
						onChange={(e) => setRoleParam(e.target.value as RoleType)}
					/>
				</SheetFilter>
			)}
			<div className="flex justify-between">
				<SearchBar
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Cari nama pengguna..."
				/>
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
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
