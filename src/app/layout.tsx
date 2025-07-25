import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { CustomAlert } from "../components/CustomAlert";
import { AlertProvider } from "../utils/useAlert";

export const metadata: Metadata = {
	title: "Absensi Rajawali",
	description:
		"Website Absensi Rajawali untuk mengelola absensi muda mudi dan juga sebagai database remaja daerah Semarang Timur dibuat dengan T3",
	icons: [{ rel: "icon", url: "/logo-rajawali.png" }],
	applicationName: "Absensi Rajawali",
	authors: [{ name: "Abdul Aziz", url: "https://abdul-aziz.me" }],
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
	category: "Absensi",
	creator: "Abdul Aziz",
	generator: "Next.js",
	pagination: {
		previous: "https://example.com/admin/generus?page=1",
		next: "https://example.com/admin/generus?page=3",
	},
	publisher: "Abdul Aziz",
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`}>
			<head>
				<script src="https://unpkg.com/react-scan/dist/auto.global.js" />
			</head>
			<body>
				<TRPCReactProvider>
					<AlertProvider>
						<CustomAlert />
						{children}
					</AlertProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
