"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Dialog from "@/components/Dialog";
import Button from "@/components/ui/Button";
import { signOut } from "../server/auth/auth-client";
import { api } from "../trpc/react";

export default function Sidebar() {
	const [logoutDialog, setLogoutDialog] = useState(false);
	const navigate = useRouter();

	const handleLogout = async () => {
		setLogoutDialog(false);
		await signOut({
			fetchOptions: {
				onError(context) {
					toast.dismiss();
					toast.error(context.error.message || "Gagal logout");
				},
				onMutate: () => {
					toast.loading("Loading...");
				},
				onSuccess(context) {
					toast.dismiss();
					toast.success(context.data.message || "Berhasil logout");
					navigate.push("/login");
				},
			},
		});
	};
	const profile = api.user.getProfile.useQuery();

	return (
		<div className="bg-gray-50 h-screen w-fit flex flex-col shadow-md sticky top-0">
			<Image
				alt="Logo Rajawali"
				className="w-28 self-center py-5"
				height={500}
				src="/logo-rajawali.png"
				width={500}
			/>
			<ul className="flex-grow space-y-2 px-4">
				<li key="Dashboard">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/dashboard"
					>
						Dashboard
					</Link>
				</li>
				<li key="Desa">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/desa"
					>
						Desa
					</Link>
				</li>
				<li key="Kelompok">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/kelompok"
					>
						Kelompok
					</Link>
				</li>
				<li key="Generus">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/generus"
					>
						Generus
					</Link>
				</li>
				<li key="Kegiatan">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/kegiatan"
					>
						Kegiatan
					</Link>
				</li>
				<li key="Presensi">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/presensi"
					>
						Presensi
					</Link>
				</li>
				<li key="Log">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/log"
					>
						Log
					</Link>
				</li>
				<li key="User">
					<Link
						className="block py-2 px-4 rounded-md hover:bg-gray-100 text-gray-800"
						href="/admin/pengguna"
					>
						Pengguna
					</Link>
				</li>
			</ul>
			<div className="py-4 px-8 mt-auto flex flex-col gap-y-2">
				<span className="text-gray-800 text-center">
					{profile.data?.data?.name}
				</span>
				<Button
					className="w-full"
					onClick={() => setLogoutDialog(true)}
					type="button"
				>
					Logout
				</Button>
			</div>
			{logoutDialog && (
				<Dialog
					cancel="Tidak"
					confirm="Ya, Logout"
					description="Apakah yakin kamu mau logout?"
					handleCancel={() => setLogoutDialog(false)}
					handleConfirm={handleLogout}
					title="Logout"
				/>
			)}
		</div>
	);
}
