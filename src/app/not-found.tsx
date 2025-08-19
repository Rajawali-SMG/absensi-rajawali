import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
	return (
		<div className="px-16 h-screen w-screen grid grid-flow-col justify-around items-center">
			<div>
				<h1 className="text-4xl">Oops....</h1>
				<h2 className="text-3xl pt-3.5 pb-4">Halaman tidak ditemukan</h2>
				<p className="text-lg pb-12">
					Halaman yang kamu cari tidak ditemukan
					<br />
					atau sudah dihapus.
				</p>
				<Link href="/admin/dashboard">Kembali</Link>
			</div>
			<Image
				alt="404 ilustration"
				height={500}
				src="/404-ilustration.png"
				width={500}
			/>
		</div>
	);
}
