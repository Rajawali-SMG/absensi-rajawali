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
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import SearchBar from "@/components/SearchBar";
import SheetCreateEvent from "@/components/Sheet/Create/Event";
import SheetUpdateEvent from "@/components/Sheet/Update/Event";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { api } from "@/trpc/react";
import type { EventSelect } from "@/types/event";
import { useAlert } from "@/utils/useAlert";

export default function KegiatanPage() {
	const navigate = useRouter();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending } = api.event.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});
	const [sheetCreate, setSheetCreate] = useState(false);
	const [sheetUpdate, setSheetUpdate] = useState(false);
	const [selectedData, setSelectedData] = useState<EventSelect | null>(null);
	const [dialog, setDialog] = useState(false);
	const [deleteId, setDeleteId] = useState("");
	const queryClient = useQueryClient();
	const { setAlert } = useAlert();

	const mutation = api.event.deleteEvent.useMutation({
		onError: (error) => {
			setAlert(error.message || "Internal Server Error", "error");
		},
	});

	const columnHelper = createColumnHelper<EventSelect>();

	const handleEdit = (row: EventSelect) => {
		setSelectedData(row);
		setSheetUpdate(true);
	};

	const handleDeleteConfirm = () => {
		mutation.mutate(
			{ id: deleteId },
			{
				onSuccess: (data) => {
					queryClient.invalidateQueries({ queryKey: ["eventData"] });
					setAlert("Data berhasil dihapus", "success");
				},
			},
		);
		setDialog(false);
		setDeleteId("");
	};

	const handleDelete = (row: EventSelect) => {
		setDeleteId(row.id);
		setDialog(true);
	};

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("title", { header: "Judul" }),
		columnHelper.accessor("start_date", { header: "Tanggal Mulai" }),
		columnHelper.accessor("end_date", { header: "Tanggal Selesai" }),
		columnHelper.accessor("latitude", { header: "Latitude" }),
		columnHelper.accessor("longitude", { header: "Longitude" }),
		columnHelper.accessor("description", { header: "Deskripsi" }),
		columnHelper.display({
			id: "actions",
			header: "Action",
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
			{sheetCreate && (
				<SheetCreateEvent closeSheet={() => setSheetCreate(false)} />
			)}
			{sheetUpdate && selectedData && (
				<SheetUpdateEvent
					closeSheet={() => setSheetUpdate(false)}
					selectedData={selectedData}
				/>
			)}
			<div className="flex justify-between">
				<SearchBar
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Search by Name"
				/>
				<Button type="button" onClick={() => setSheetCreate(true)}>
					Buat Kegiatan
				</Button>
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
								<tr key={row.id} className="border-b">
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
									{ value: 10, label: "10" },
									{ value: 20, label: "20" },
									{ value: 50, label: "50" },
									{ value: 100, label: "100" },
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
