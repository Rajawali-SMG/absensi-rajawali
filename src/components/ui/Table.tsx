import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	type OnChangeFn,
	type PaginationState,
	useReactTable,
} from "@tanstack/react-table";
import Skeleton from "../Skeleton";
import Button from "./Button";
import Select from "./Select";

type Props<
	T extends Record<string, string | number | Date | undefined | null>,
> = {
	isPending: boolean;
	data: T[];
	columns: ColumnDef<T>[];
	rowCount: number;
	onPaginationChange: OnChangeFn<PaginationState>;
	pagination: PaginationState;
};

export default function Table<
	T extends Record<string, string | number | Date | undefined | null>,
>({
	isPending,
	data,
	columns,
	rowCount,
	onPaginationChange,
	pagination,
}: Props<T>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		rowCount,
		onPaginationChange,
		state: {
			pagination,
		},
		manualFiltering: true,
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div className="overflow-auto">
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
		</div>
	);
}
