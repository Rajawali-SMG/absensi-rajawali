"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { LogSelect } from "@/types/log";

export default function LogPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const searchQuery = useSearchParams().get("q") || "";
	const { data, isPending, error, isError } = api.log.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
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

	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError, error]);

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
