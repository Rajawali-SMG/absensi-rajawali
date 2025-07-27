"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetFilter from "@/components/SheetFilter";
import Skeleton from "@/components/Skeleton";
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
import type { GenerusSelect } from "@/types/generus";
import { useAlert } from "@/utils/useAlert";

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
	// const [jenisKelaminParam, setJenisKelaminParam] = useQueryState(
	// 	"jenis_kelamin",
	// 	{
	// 		defaultValue: "",
	// 	},
	// );
	// const [jenjangParam, setJenjangParam] = useQueryState("jenjang", {
	// 	defaultValue: "",
	// });
	// const [pendidikanTerakhirParam, setPendidikanTerakhirParam] = useQueryState(
	// 	"pendidikan_terakhir",
	// 	{
	// 		defaultValue: "",
	// 	},
	// );
	// const [sambungParam, setSambungParam] = useQueryState("sambung", {
	// 	defaultValue: "",
	// });
	// const [keteranganParam, setKeteranganParam] = useQueryState("keterangan", {
	// 	defaultValue: "",
	// });
	const { data, isPending } = api.generus.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		// jenis_kelamin: jenisKelaminParam,
		// jenjang: jenjangParam,
		// pendidikan_terakhir: pendidikanTerakhirParam,
		// sambung: sambungParam,
		// keterangan: keteranganParam,
	});
	const { setAlert } = useAlert();
	const utils = api.useUtils();

	const mutation = api.generus.deleteGenerus.useMutation({
		onError: ({ message }) => {
			setAlert(message, "error");
		},
		onSuccess: ({ message }) => {
			utils.generus.getAllPaginated.invalidate();
			setAlert(message, "success");
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
			accessorKey: "id",
		},
		{
			accessorKey: "nama",
		},
		{
			accessorKey: "jenis_kelamin",
			header: "Jenis Kelamin",
		},
		{
			accessorKey: "jenjang",
		},
		{
			accessorKey: "alamat_tempat_tinggal",
			header: "Alamat Tempat Tinggal",
		},
		{
			accessorKey: "sambung",
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

	// useEffect(() => {
	// 	if (isError) {
	// 		setAlert(
	// 			error.response?.data.message || "Internal Server Error",
	// 			"error",
	// 		);
	// 	}
	// }, [isError, error]);

	// const handleFilter = (value) => {
	// 	setJenisKelaminParam(value.value);
	// 	setJenjangParam(value.value);
	// 	setPendidikanTerakhirParam(value.value);
	// 	setSambungParam(value.value);
	// 	setKeteranganParam(value.value);
	// 	setSheetFilter(false);
	// };

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
			{/* {sheetFilter && (
				<SheetFilter
					closeSheet={() => setSheetFilter(false)}
					submitFilter={() => setSheetFilter(false)}
				> */}
			{/* <Select
						name="jenis_kelamin"
						label="Jenis Kelamin"
						options={jenisKelaminOptions}
						placeholder="Pilih Jenis Kelamin"
						value={jenisKelaminParam}
						onChange={(e) => setJenisKelaminParam(e.target.value)}
					/>
					<Select
						name="jenjang"
						label="Jenjang"
						options={jenjangOptions}
						placeholder="Pilih Jenjang"
						value={jenjangParam}
						onChange={(e) => setJenjangParam(e.target.value)}
					/>
					<Select
						name="pendidikan_terakhir"
						label="Pendidikan Terakhir"
						options={pendidikanTerakhirOptions}
						placeholder="Pilih Pendidikan Terakhir"
						value={pendidikanTerakhirParam}
						onChange={(e) => setPendidikanTerakhirParam(e.target.value)}
					/>
					<Select
						name="sambung"
						label="Sambung"
						options={sambungOptions}
						placeholder="Pilih Sambung"
						value={sambungParam}
						onChange={(e) => setSambungParam(e.target.value)}
					/>
					<Select
						name="keterangan"
						label="Keterangan"
						options={keteranganOptions}
						placeholder="Pilih Keterangan"
						value={keteranganParam}
						onChange={(e) => setKeteranganParam(e.target.value)}
					/> */}
			{/* </SheetFilter>
			)} */}
			<div className="flex justify-between">
				<SearchBar
					placeholder="Cari Nama Generus"
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				/>
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
				<Link href="/admin/generus/create">Tambah Generus</Link>
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
