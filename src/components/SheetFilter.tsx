import type { ReactNode } from "react";
import Button from "./ui/Button";

export default function SheetFilter({
	closeSheet,
	children,
	submitFilter,
}: {
	closeSheet: () => void;
	children: ReactNode;
	submitFilter: () => void;
}) {
	return (
		<div className="bg-black/50 inset-0 fixed">
			<div className="bg-white p-4">
				<h2 className="text-xl font-bold">Filter</h2>
				<div className="flex flex-col gap-y-2">{children}</div>
				<div className="flex justify-end gap-x-2">
					<Button onClick={closeSheet}>Close</Button>
					<Button onClick={submitFilter}>Apply</Button>
				</div>
			</div>
		</div>
	);
}
