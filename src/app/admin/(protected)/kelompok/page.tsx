"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomSelect from "@/components/CustomSelect";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateKelompok from "@/components/Sheet/Create/Kelompok";
import SheetUpdateKelompok from "@/components/Sheet/Update/Kelompok";
import SheetFilter from "@/components/SheetFilter";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { KelompokSelect } from "@/types/kelompok";

export default function KelompokPage() {
	const [desaParam, setDesaParam] = useState("");
	const [sheetFilter, setSheetFilter] = useState(false);
	const searchParams = useSearchParams();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [dialog, setDialog] = useState(false);
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<KelompokSelect | null>(null);
	const [deleteId, setDeleteId] = useState("");
	const searchQuery = searchParams.get("q") || "";

	const {
		data: kelompokData,
		isPending,
		isError,
		error,
	} = api.kelompok.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		desaId: desaParam,
	});
	const mutation = api.kelompok.deleteKelompok.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
	});
	const utils = api.useUtils();
	const handleDeleteConfirm = () => {
		mutation.mutate(
			{ id: deleteId },
			{
				onSuccess: (data) => {
					utils.kelompok.getAllPaginated.invalidate();
					toast.success(data.message);
				},
			},
		);
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: KelompokSelect) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const handleEdit = (row: KelompokSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const columns: ColumnDef<KelompokSelect>[] = [
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
	const {
		data: desaData,
		isError: isDesaError,
		error: desaError,
	} = api.desa.getAll.useQuery();

	const desaOptions =
		desaData?.data.map((item) => ({
			value: item.id,
			label: item.nama,
		})) || [];

	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError, error]);

	useEffect(() => {
		if (isDesaError) {
			toast.error(desaError.message);
		}
	}, [isDesaError, desaError]);

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
				<SheetCreateKelompok closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateKelompok
					closeSheet={() => setSheetUpdate(false)}
					selectedData={selectedData}
				/>
			)}
			{sheetFilter && (
				<SheetFilter
					closeSheet={() => setSheetFilter(false)}
					submitFilter={() => setSheetFilter(false)}
					resetFilter={() => {
						setDesaParam("");
						setSheetFilter(false);
					}}
				>
					<CustomSelect
						placeHolderEnabled={true}
						name="desa_id"
						label="Desa"
						options={desaOptions}
						placeholder="Pilih Desa"
						value={desaParam}
						onChange={(e) => setDesaParam(e.target.value)}
					/>
				</SheetFilter>
			)}
			<div className="flex justify-between mb-4">
				<SearchBar
					placeholder="Cari kelompok..."
					className="w-full max-w-lg"
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				/>
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
				<Button type="button" onClick={() => setSheetCreate(true)}>
					Tambah Kelompok
				</Button>
			</div>
			<Table
				isPending={isPending}
				data={kelompokData?.data.items || []}
				columns={columns}
				rowCount={kelompokData?.data.meta.total || 0}
				onPaginationChange={setPagination}
				pagination={pagination}
			/>
		</>
	);
}
