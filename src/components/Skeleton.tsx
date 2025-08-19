import type { Table } from "@tanstack/react-table";

export default function Skeleton<T>(table: Table<T>) {
	return Array.from({ length: 5 }).map((_, idx) => (
		<tr className="animate-pulse" key={idx}>
			{table.getAllColumns().map((col) => (
				<td className="px-6 py-4" key={col.id}>
					<div className="bg-gray-400 rounded-full h-4" />
				</td>
			))}
		</tr>
	));
}
