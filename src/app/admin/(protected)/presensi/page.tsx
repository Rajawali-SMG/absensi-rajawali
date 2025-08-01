"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { PresenceSelect } from "@/types/presence";

export default function PresensiPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const { data, isPending, error, isError } =
		api.presence.getAllPaginated.useQuery({
			limit: pagination.pageSize,
			page: pagination.pageIndex,
		});

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

	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError, error]);

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
