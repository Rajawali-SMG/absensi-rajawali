"use client";

import Link from "next/link";
import { use, useEffect } from "react";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";
import { env } from "@/env";
import { api } from "@/trpc/react";

export default function QrPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const {
		data: eventData,
		error,
		promise,
		isSuccess,
		isError,
	} = api.event.getOneEventPublic.useQuery({
		id,
	});

	useEffect(() => {
		toast.promise(promise, {
			error: error?.message,
			loading: "Loading...",
			success: eventData?.message,
		});
	}, [eventData, error, promise]);

	return (
		<div className="flex flex-col gap-y-2 items-center p-4 w-screen h-screen overflow-hidden">
			{isSuccess && (
				<>
					<h1 className="font-bold text-ellipsis">{eventData?.data.title}</h1>
					<p className="text-gray-600">{eventData?.data.description}</p>
					<QRCode
						value={`${env.NEXT_PUBLIC_BASE_URL}/absen/${eventData?.data.id}`}
					/>
					<span>Link Absensi</span>
					<Link href={`/absen/${eventData?.data.id}`}>
						{env.NEXT_PUBLIC_BASE_URL}/absen/{eventData?.data.id}
					</Link>
					<Link href={`/izin/${eventData?.data.id}`}>
						{env.NEXT_PUBLIC_BASE_URL}/izin/{eventData?.data.id}
					</Link>
				</>
			)}
			{isError && <h1 className="font-bold text-ellipsis">{error?.message}</h1>}
		</div>
	);
}
