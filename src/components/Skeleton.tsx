import type { Table } from "@tanstack/react-table";

export default function Skeleton<T>(table: Table<T>) {
	return Array.from({ length: 5 }).map((_, idx) => (
		<tr key={idx} className="animate-pulse">
			{table.getAllColumns().map((col) => (
				<td key={col.id} className="px-6 py-4">
					<div className="bg-gray-400 rounded-full h-4" />
				</td>
			))}
		</tr>
	));
}
