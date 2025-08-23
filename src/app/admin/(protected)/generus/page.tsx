"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Dialog from "@/components/Dialog";
import ExportGenerus from "@/components/ExportGenerus";
import SearchBar from "@/components/SearchBar";
import SheetFilter from "@/components/SheetFilter";
import UploadExcelDialog from "@/components/UploadGenerus";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
import {
	jenisKelaminOptions,
	jenjangOptions,
	keteranganOptions,
	pendidikanTerakhirOptions,
	sambungOptions,
} from "@/constants/generus";
import { api } from "@/trpc/react";
import type {
	GenerusSelect,
	JenisKelaminType,
	JenjangType,
	KeteranganType,
	PendidikanTerakhirType,
	SambungType,
} from "@/types/generus";
import useToastError from "@/utils/useToastError";

export default function GenerusPage() {
	const searchQuery = useSearchParams().get("q") || "";
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const navigate = useRouter();
	const [dialog, setDialog] = useState(false);
	const [sheetFilter, setSheetFilter] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const [jenisKelaminParam, setJenisKelaminParam] =
		useState<JenisKelaminType>();
	const [jenjangParam, setJenjangParam] = useState<JenjangType>();
	const [pendidikanTerakhirParam, setPendidikanTerakhirParam] =
		useState<PendidikanTerakhirType>();
	const [sambungParam, setSambungParam] = useState<SambungType>();
	const [keteranganParam, setKeteranganParam] = useState<KeteranganType>();
	const { data, isPending, error } = api.generus.getAllPaginated.useQuery({
		jenisKelamin: jenisKelaminParam,
		jenjang: jenjangParam,
		keterangan: keteranganParam,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		pendidikanTerakhir: pendidikanTerakhirParam,
		q: searchQuery,
		sambung: sambungParam,
	});
	const utils = api.useUtils();

	const { mutate } = api.generus.deleteGenerus.useMutation({
		onError: ({ message }) => {
			toast.dismiss();

			toast.error(message);
		},
		onMutate: () => {
			toast.loading("Loading...");
		},
		onSuccess: ({ message }) => {
			utils.generus.invalidate();
			toast.dismiss();
			toast.success(message);
		},
	});

	const handleDeleteConfirm = () => {
		mutate({ id: deleteId });
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: GenerusSelect) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns: ColumnDef<GenerusSelect>[] = [
		{
			accessorKey: "nama",
		},
		{
			accessorKey: "jenisKelamin",
			header: "Jenis Kelamin",
		},
		{
			accessorKey: "jenjang",
		},
		{
			accessorKey: "keterangan",
		},
		{
			accessorKey: "alamatTempatTinggal",
			header: "Alamat Tempat Tinggal",
		},
		{
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<button
							onClick={() => {
								return navigate.push(`/admin/generus/update/${row.id}`);
							}}
							type="button"
						>
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
			{sheetFilter && (
				<SheetFilter
					closeSheet={() => setSheetFilter(false)}
					resetFilter={() => {
						setJenisKelaminParam(undefined);
						setJenjangParam(undefined);
						setPendidikanTerakhirParam(undefined);
						setSambungParam(undefined);
						setKeteranganParam(undefined);
						setSheetFilter(false);
					}}
					submitFilter={() => setSheetFilter(false)}
				>
					<Select
						id="jenis_kelamin"
						label="Jenis Kelamin"
						name="jenis_kelamin"
						onChange={(e) =>
							setJenisKelaminParam(e.target.value as JenisKelaminType)
						}
						options={jenisKelaminOptions}
						placeHolderEnabled={true}
						placeholder="Pilih Jenis Kelamin"
						value={jenisKelaminParam}
					/>
					<Select
						id="jenjang"
						label="Jenjang"
						name="jenjang"
						onChange={(e) => setJenjangParam(e.target.value as JenjangType)}
						options={jenjangOptions}
						placeHolderEnabled={true}
						placeholder="Pilih Jenjang"
						value={jenjangParam}
					/>
					<Select
						id="pendidikan_terakhir"
						label="Pendidikan Terakhir"
						name="pendidikan_terakhir"
						onChange={(e) =>
							setPendidikanTerakhirParam(
								e.target.value as PendidikanTerakhirType,
							)
						}
						options={pendidikanTerakhirOptions}
						placeHolderEnabled={true}
						placeholder="Pilih Pendidikan Terakhir"
						value={pendidikanTerakhirParam}
					/>
					<Select
						id="sambung"
						label="Sambung"
						name="sambung"
						onChange={(e) => setSambungParam(e.target.value as SambungType)}
						options={sambungOptions}
						placeHolderEnabled={true}
						placeholder="Pilih Sambung"
						value={sambungParam}
					/>
					<Select
						id="keterangan"
						label="Keterangan"
						name="keterangan"
						onChange={(e) =>
							setKeteranganParam(e.target.value as KeteranganType)
						}
						options={keteranganOptions}
						placeHolderEnabled={true}
						placeholder="Pilih Keterangan"
						value={keteranganParam}
					/>
				</SheetFilter>
			)}
			<div className="flex justify-between">
				<SearchBar
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Cari Nama Generus"
				/>
				<UploadExcelDialog />
				<ExportGenerus />
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
				<Link href="/admin/generus/create">Tambah Generus</Link>
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
