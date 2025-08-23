"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import Table from "@/components/ui/Table";
import { api } from "@/trpc/react";
import type { PresenceSelect } from "@/types/presence";
import useToastError from "@/utils/useToastError";

export default function PresensiPage() {
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const { data, isPending, error } = api.presence.getAllPaginated.useQuery({
		limit: pagination.pageSize,
		page: pagination.pageIndex,
	});

	const columns: ColumnDef<PresenceSelect>[] = [
		{
			accessorKey: "id",
		},
		{
			accessorKey: "eventId",
			header: "Event ID",
		},
		{
			accessorKey: "generusName",
			header: "Nama Generus",
		},
		{
			accessorKey: "status",
		},
	];

	useToastError(error);

	return (
		<Table
			columns={columns}
			data={data?.data.items || []}
			isPending={isPending}
			onPaginationChange={setPagination}
			pagination={pagination}
			rowCount={data?.data.meta.total || 0}
		/>
	);
}
