"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useQueryClient } from "@tanstack/react-query";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetFilter from "@/components/SheetFilter";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import {
	jenisKelaminOptions,
	jenjangOptions,
	keteranganOptions,
	pendidikanTerakhirOptions,
	sambungOptions,
} from "@/constants/generus";
import type { Generus } from "@/generated/client/client";
import { api } from "@/trpc/react";
import { useAlert } from "@/utils/useAlert";

export default function GenerusPage() {
	const searchQuery = useSearchParams().get("q") || "";
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 9,
	});
	const navigate = useRouter();
	const [dialog, setDialog] = useState(false);
	const [sheetFilter, setSheetFilter] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const queryClient = useQueryClient();
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

	const mutation = api.generus.deleteGenerus.useMutation({
		onError: (error) => {
			setAlert(error.message || "Internal Server Error", "error");
		},
	});

	const columnHelper = createColumnHelper<Generus>();

	const handleDeleteConfirm = () => {
		mutation.mutate(
			{ id: deleteId },
			{
				onSuccess: (data) => {
					queryClient.invalidateQueries({ queryKey: ["generusData"] });
					setAlert(data.message, "success");
				},
			},
		);
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: Generus) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("nama", { header: "Nama" }),
		columnHelper.accessor("jenis_kelamin", { header: "Jenis Kelamin" }),
		columnHelper.accessor("jenjang", { header: "Jenjang" }),
		columnHelper.accessor("alamat_tempat_tinggal", {
			header: "Alamat Tempat Tinggal",
		}),
		columnHelper.accessor("sambung", { header: "Sambung" }),
		columnHelper.display({
			id: "actions",
			header: "Action",
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
			enableHiding: true,
		}),
	];

	const table = useReactTable({
		data: data?.data?.items || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		rowCount: data?.data?.meta?.total || 0,
		onPaginationChange: setPagination,
		state: {
			pagination,
		},
		manualFiltering: true,
		getFilteredRowModel: getFilteredRowModel(),
	});

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
					cancel="Cancel"
					confirm="Delete"
					title="Are you sure you want to delete this data?"
					handleCancel={() => setDialog(false)}
					handleConfirm={handleDeleteConfirm}
					description="This action cannot be undone."
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
					placeholder="Search by Name"
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				/>
				<Button onClick={() => setSheetFilter(true)}>Filter</Button>
				<Link href="/admin/generus/create">Create Generus</Link>
			</div>
			<table className="w-full text-left text-sm text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} className="px-6 py-3">
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{isPending
						? Skeleton(table)
						: table.getRowModel().rows.map((row) => (
								<tr key={row.id} className="bg-white border-b">
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-6 py-4">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
				</tbody>
				<tfoot>
					<tr>
						<td>
							<Button
								type="button"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
							<Button
								type="button"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								Next
							</Button>
							<Select
								name="pageSize"
								options={[
									{ value: 9, label: "9" },
									{ value: 19, label: "19" },
									{ value: 20, label: "20" },
									{ value: 30, label: "30" },
								]}
								placeholder="Select Page Size"
								value={table.getState().pagination.pageSize}
								onChange={(e) => table.setPageSize(Number(e.target.value))}
							/>
							<p>Total Page: {table.getPageCount()}</p>
							<p>Total Row: {table.getRowCount()}</p>
						</td>
					</tr>
				</tfoot>
			</table>
		</>
	);
}
