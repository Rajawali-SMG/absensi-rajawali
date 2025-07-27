"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Table from "@/components/ui/Table";
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

	const columns: ColumnDef<DesaSelect>[] = [
		{
			accessorKey: "id",
		},
		{
			accessorKey: "nama",
		},
	];

	return (
		<>
			<div className="flex justify-between">
				<SearchBar
					placeholder="Cari Nama Desa..."
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
