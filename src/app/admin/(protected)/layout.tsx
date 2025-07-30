"use client";

import { redirect, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useSession } from "@/server/auth/client";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = useSession;

	if (!session) {
		redirect("/admin/login");
	}

	const pathname = usePathname();
	return (
		<div className="flex">
			<Sidebar />
			<div className="flex-1 p-5 bg-white overflow-x-auto">
				<h1 className="text-2xl font-bold">{pathname}</h1>
				{children}
			</div>
		</div>
	);
}
