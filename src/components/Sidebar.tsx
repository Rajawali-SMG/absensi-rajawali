"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import Button from "@/components/ui/Button";
import { useAlert } from "@/utils/useAlert";
import { signOut } from "../server/auth/client";

export default function Sidebar() {
	const [logoutDialog, setLogoutDialog] = useState(false);
	const navigate = useRouter();
	const { setAlert } = useAlert();

	const handleLogout = async () => {
		setLogoutDialog(false);
		await signOut({
			fetchOptions: {
				onSuccess(context) {
					setAlert(context.data.message || "Berhasil logout", "success");
					navigate.push("/admin/login");
				},
				onError(context) {
					setAlert(context.error.message || "Gagal logout", "error");
				},
			},
		});
	};

	return (
		<div className="bg-gray-50 h-screen w-fit flex flex-col shadow-md sticky top-0">
			<Image
				src="/logo-rajawali.png"
				width={500}
				height={500}
				alt="Logo Rajawali"
				className="w-28 self-center py-5"
			/>
			<ul className="flex-grow space-y-2 px-4">
				<li key="Dashboard">
					<Link
						href="/admin/dashboard"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Dashboard
					</Link>
				</li>
				<li key="Desa">
					<Link
						href="/admin/desa"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Desa
					</Link>
				</li>
				<li key="Kelompok">
					<Link
						href="/admin/kelompok"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Kelompok
					</Link>
				</li>
				<li key="Generus">
					<Link
						href="/admin/generus"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Generus
					</Link>
				</li>
				<li key="Kegiatan">
					<Link
						href="/admin/kegiatan"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Kegiatan
					</Link>
				</li>
				<li key="Presensi">
					<Link
						href="/admin/presensi"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Presensi
					</Link>
				</li>
				<li key="Log">
					<Link
						href="/admin/log"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Log
					</Link>
				</li>
				<li key="User">
					<Link
						href="/admin/pengguna"
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
					>
						Pengguna
					</Link>
				</li>
			</ul>
			<div className="py-4 px-8 mt-auto">
				<Button
					type="button"
					onClick={() => setLogoutDialog(true)}
					className="w-full"
				>
					Logout
				</Button>
			</div>
			{logoutDialog && (
				<Dialog
					title="Logout"
					description="Apakah yakin kamu mau login?"
					cancel="Tidak"
					confirm="Ya, Logout"
					handleCancel={() => setLogoutDialog(false)}
					handleConfirm={handleLogout}
				/>
			)}
		</div>
	);
}
