import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
	applicationName: "Absensi Rajawali",
	authors: [{ name: "Abdul Aziz", url: "https://abdul-aziz.me" }],
	category: "Absensi",
	creator: "Abdul Aziz",
	description:
		"Website Absensi Rajawali untuk mengelola absensi muda mudi dan juga sebagai database remaja daerah Semarang Timur dibuat dengan T3",
	generator: "Next.js",
	icons: [{ rel: "icon", url: "/logo-rajawali.png" }],
	keywords: [
		"Absensi",
		"Rajawali",
		"Remaja",
		"Muda-Mudi",
		"Semarang Timur",
		"T3",
		"React",
		"Nextjs",
		"Drizzle",
		"Tailwind CSS",
		"TypeScript",
		"PostgreSQL",
		"FullStack Web",
	],
	pagination: {
		next: "https://example.com/admin/generus?page=3",
		previous: "https://example.com/admin/generus?page=1",
	},
	publisher: "Abdul Aziz",
	title: "Absensi Rajawali",
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable}`} lang="en">
			<head>
				<script src="https://unpkg.com/react-scan/dist/auto.global.js" />
			</head>
			<body>
				<TRPCReactProvider>
					<Toaster />
					{children}
				</TRPCReactProvider>
			</body>
		</html>
	);
}
