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

type Props<T extends Record<string, unknown>> = {
	isPending: boolean;
	data: T[];
	columns: ColumnDef<T>[];
	rowCount: number;
	onPaginationChange: OnChangeFn<PaginationState>;
	pagination: PaginationState;
};

export default function Table<T extends Record<string, unknown>>({
	isPending,
	data,
	columns,
	rowCount,
	onPaginationChange,
	pagination,
}: Props<T>) {
	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		manualFiltering: true,
		manualPagination: true,
		onPaginationChange,
		rowCount,
		state: {
			pagination,
		},
	});

	return (
		<div className="overflow-auto p-2">
			<table className="w-full text-left text-sm text-gray-500">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th className="px-6 py-3" key={header.id}>
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
								<tr className="border-b" key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<td className="px-6 py-4" key={cell.id}>
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
						<td className="pt-5">
							<Button
								disabled={!table.getCanPreviousPage()}
								onClick={() => table.previousPage()}
								type="button"
							>
								Previous
							</Button>
							<Button
								disabled={!table.getCanNextPage()}
								onClick={() => table.nextPage()}
								type="button"
							>
								Next
							</Button>
							<Select
								name="pageSize"
								onChange={(e) => table.setPageSize(Number(e.target.value))}
								options={[
									{ label: "10", value: 10 },
									{ label: "20", value: 20 },
									{ label: "50", value: 50 },
									{ label: "100", value: 100 },
								]}
								placeholder="Select Page Size"
								value={table.getState().pagination.pageSize}
							/>
							<p className="pt-2 pb-1">Total Page: {table.getPageCount()}</p>
							<p>Total Row: {table.getRowCount()}</p>
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}
