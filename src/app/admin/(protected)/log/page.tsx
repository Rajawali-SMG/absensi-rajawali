"use client";

import {
	createColumnHelper,
	useReactTable,
	getCoreRowModel,
	flexRender,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import type { Log } from "@/generated/client/client";
import { api } from "@/trpc/react";
import { useAlert } from "@/utils/useAlert";

export default function LogPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 9,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data } = api.log.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});
	const { setAlert } = useAlert();

	const columnHelper = createColumnHelper<Log>();

	const columns = [
		columnHelper.accessor("id", { header: "ID" }),
		columnHelper.accessor("event", { header: "Event" }),
		columnHelper.accessor("description", { header: "Description" }),
		columnHelper.accessor("user_id", { header: "User ID" }),
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
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Search by Event or Description"
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
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="bg-white border-b">
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-6 py-4">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}
