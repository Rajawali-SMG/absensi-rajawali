"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
	const { data, isPending, isError, error } =
		api.generus.getAllPaginated.useQuery({
			q: searchQuery,
			limit: pagination.pageSize,
			page: pagination.pageIndex,
			jenisKelamin: jenisKelaminParam,
			jenjang: jenjangParam,
			pendidikanTerakhir: pendidikanTerakhirParam,
			sambung: sambungParam,
			keterangan: keteranganParam,
		});
	const utils = api.useUtils();

	const mutation = api.generus.deleteGenerus.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onSuccess: ({ message }) => {
			utils.generus.getAllPaginated.invalidate();
			toast.success(message);
		},
	});

	const handleDeleteConfirm = () => {
		mutation.mutate({ id: deleteId });
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
			accessorKey: "alamatTempatTinggal",
			header: "Alamat Tempat Tinggal",
		},
		{
			accessorKey: "keterangan",
		},
		{
			id: "aksi",
			header: "Aksi",
			cell: (props) => {
				const row = props.row.original;
				return (
					<div className="flex space-x-2">
						<button
							type="button"
							onClick={() => {
								return navigate.push(`/admin/generus/update/${row.id}`);
							}}
						>
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
			{sheetFilter && (
				<SheetFilter
					closeSheet={() => setSheetFilter(false)}
					submitFilter={() => setSheetFilter(false)}
					resetFilter={() => {
						setJenisKelaminParam(undefined);
						setJenjangParam(undefined);
						setPendidikanTerakhirParam(undefined);
						setSambungParam(undefined);
						setKeteranganParam(undefined);
						setSheetFilter(false);
					}}
				>
					<Select
						placeHolderEnabled={true}
						name="jenis_kelamin"
						label="Jenis Kelamin"
						options={jenisKelaminOptions}
						placeholder="Pilih Jenis Kelamin"
						value={jenisKelaminParam}
						onChange={(e) =>
							setJenisKelaminParam(e.target.value as JenisKelaminType)
						}
					/>
					<Select
						placeHolderEnabled={true}
						name="jenjang"
						label="Jenjang"
						options={jenjangOptions}
						placeholder="Pilih Jenjang"
						value={jenjangParam}
						onChange={(e) => setJenjangParam(e.target.value as JenjangType)}
					/>
					<Select
						placeHolderEnabled={true}
						name="pendidikan_terakhir"
						label="Pendidikan Terakhir"
						options={pendidikanTerakhirOptions}
						placeholder="Pilih Pendidikan Terakhir"
						value={pendidikanTerakhirParam}
						onChange={(e) =>
							setPendidikanTerakhirParam(
								e.target.value as PendidikanTerakhirType,
							)
						}
					/>
					<Select
						placeHolderEnabled={true}
						name="sambung"
						label="Sambung"
						options={sambungOptions}
						placeholder="Pilih Sambung"
						value={sambungParam}
						onChange={(e) => setSambungParam(e.target.value as SambungType)}
					/>
					<Select
						placeHolderEnabled={true}
						name="keterangan"
						label="Keterangan"
						options={keteranganOptions}
						placeholder="Pilih Keterangan"
						value={keteranganParam}
						onChange={(e) =>
							setKeteranganParam(e.target.value as KeteranganType)
						}
					/>
				</SheetFilter>
			)}
			<div className="flex justify-between">
				<SearchBar
					placeholder="Cari Nama Generus"
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				/>
				<UploadExcelDialog />
				<ExportGenerus />
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
				<Link href="/admin/generus/create">Tambah Generus</Link>
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
