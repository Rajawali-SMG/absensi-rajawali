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
import useToastError from "@/utils/useToastError";

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
		error,
	} = api.kelompok.getAllPaginated.useQuery({
		desaId: desaParam,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		q: searchQuery,
	});
	const {
		mutateAsync,
		data: deleteData,
		error: deleteError,
	} = api.kelompok.deleteKelompok.useMutation({
		onSuccess: () => {
			utils.kelompok.getAllPaginated.invalidate();
		},
	});
	const utils = api.useUtils();
	const handleDeleteConfirm = () => {
		toast.promise(mutateAsync({ id: deleteId }), {
			error: deleteError?.message,
			loading: "Loading...",
			success: deleteData?.message,
		});
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
			accessorKey: "code",
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
	const {
		data: desaData,
		isError: isDesaError,
		error: desaError,
	} = api.desa.getAll.useQuery();

	const desaOptions =
		desaData?.data.map((item) => ({
			label: item.nama,
			value: item.id,
		})) || [];

	useToastError(error);
	useToastError(desaError);

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
					description="Tindakan ini tidak dapat dibatalkan."
					handleCancel={() => setDialog(false)}
					handleConfirm={handleDeleteConfirm}
					title="Apakah Anda yakin ingin menghapus data ini?"
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
					resetFilter={() => {
						setDesaParam("");
						setSheetFilter(false);
					}}
					submitFilter={() => setSheetFilter(false)}
				>
					<CustomSelect
						label="Desa"
						name="desa_id"
						onChange={(e) => setDesaParam(e?.value || "")}
						options={desaOptions}
						placeholder="Pilih Desa"
						value={
							desaOptions.find((option) => option.value === desaParam) || null
						}
					/>
				</SheetFilter>
			)}
			<div className="flex justify-between mb-4">
				<SearchBar
					className="w-full max-w-lg"
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Cari kelompok..."
				/>
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
				<Button onClick={() => setSheetCreate(true)} type="button">
					Tambah Kelompok
				</Button>
			</div>
			<Table
				columns={columns}
				data={kelompokData?.data.items || []}
				isPending={isPending}
				onPaginationChange={setPagination}
				pagination={pagination}
				rowCount={kelompokData?.data.meta.total || 0}
			/>
		</>
	);
}
