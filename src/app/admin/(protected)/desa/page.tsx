"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { api } from "@/trpc/react";
import type { DesaSelect } from "@/types/desa";
import { useAlert } from "@/utils/useAlert";

export default function DesaPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending } = api.desa.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});
	const { setAlert } = useAlert();

	const columnHelper = createColumnHelper<DesaSelect>();

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("nama", { header: "Nama" }),
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
			<div className="flex justify-between">
				<SearchBar
					placeholder="Search by Name"
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				/>
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
