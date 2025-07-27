"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { PresenceSelect } from "@/types/presence";
import { useAlert } from "@/utils/useAlert";

export default function PresensiPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const { data, isPending } = api.presence.getAllPaginated.useQuery({
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});
	const { setAlert } = useAlert();

	const columns: ColumnDef<PresenceSelect>[] = [
		{
			accessorKey: "id",
		},
		{
			accessorKey: "event_id",
			header: "Event ID",
		},
		{
			accessorKey: "generus_id",
			header: "Generus ID",
		},
		{
			accessorKey: "status",
		},
	];

	return (
		<Table
			isPending={isPending}
			data={data?.data?.items || []}
			columns={columns}
			rowCount={data?.data?.meta?.total || 0}
			onPaginationChange={setPagination}
			pagination={pagination}
		/>
	);
}
