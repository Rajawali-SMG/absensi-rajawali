"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { KelompokSelect } from "@/types/kelompok";
import { useAlert } from "@/utils/useAlert";

export default function KelompokPage() {
	const searchParams = useSearchParams();
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const searchQuery = searchParams.get("q") || "";

	const { data, isPending } = api.kelompok.getAllPaginated.useQuery({
		q: searchQuery,
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});
	const { setAlert } = useAlert();

	const columns: ColumnDef<KelompokSelect>[] = [
		{
			accessorKey: "id",
		},
		{
			accessorKey: "nama",
		},
	];

	return (
		<>
			<div className="flex justify-between mb-4">
				<SearchBar
					placeholder="Cari kelompok..."
					className="w-full max-w-lg"
					onSearchChange={() => {
						setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					}}
				/>
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
