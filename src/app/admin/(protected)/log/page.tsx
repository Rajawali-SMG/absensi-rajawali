"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { LogSelect } from "@/types/log";
import useToastError from "@/utils/useToastError";

export default function LogPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending, error } = api.log.getAllPaginated.useQuery({
		limit: pagination.pageSize,
		page: pagination.pageIndex,
		q: searchQuery,
	});

	const columns: ColumnDef<LogSelect>[] = [
		{
			accessorKey: "id",
			header: "ID",
		},
		{
			accessorKey: "event",
			header: "Event",
		},
		{
			accessorKey: "description",
			header: "Description",
		},
		{
			accessorKey: "userId",
			header: "User ID",
		},
	];

	useToastError(error);

	return (
		<>
			<div className="flex justify-between">
				<SearchBar
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
					placeholder="Cari Event atau Deskripsi..."
				/>
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
