"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 p-5 bg-white overflow-x-auto">
				<h1 className="font-bold pb-2">{pathname}</h1>
				<Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
			</div>
		</div>
	);
}
