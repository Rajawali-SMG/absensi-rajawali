"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "@tanstack/react-form";
import { use, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import toast from "react-hot-toast";
import CustomSelect from "@/components/CustomSelect";
import Button from "@/components/ui/Button";
import { api } from "@/trpc/react";
import { calculateDistance } from "@/utils/calculateDistance";
import useLocation from "@/utils/useLocation";
import useToastError from "@/utils/useToastError";

export default function IzinPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const utils = api.useUtils();
	const { id } = use(params);
	const {
		data: eventData,
		error,
		isPending,
	} = api.event.getOneEventPublic.useQuery({
		id,
	});
	const {
		mutateAsync,
		data: createData,
		error: createError,
	} = api.presence.createPresence.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onSuccess: () => {
			utils.generus.withKelompok.invalidate();
			utils.event.countGenerus.invalidate();
		},
	});
	const form = useForm({
		defaultValues: {
			eventId: id,
			generusId: "",
			status: "Izin",
		},
		onSubmit: ({ value }) => {
			toast.promise(
				mutateAsync({
					eventId: id,
					generusId: value.generusId,
					status: "Izin",
				}),
				{
					error: createError?.message,
					loading: "Loading...",
					success: createData?.message,
				},
			);
		},
	});
	const { data: presenceData, error: presenceError } =
		api.generus.withKelompok.useQuery({
			id,
		});
	const { data: presenceCount, error: presenceCountError } =
		api.event.countGenerus.useQuery({
			id,
		});
	const geo = useGeolocated({
		positionOptions: {
			enableHighAccuracy: true,
		},
	});
	const locationData = useLocation(geo.coords?.latitude, geo.coords?.longitude);
	const radius = 1; //1km
	const latitude = eventData?.data.latitude;
	const longitude = eventData?.data.longitude;

	useToastError(error);
	useToastError(presenceError);
	useToastError(presenceCountError);

	const getStatusConfig = () => {
		switch (eventData?.data.status) {
			case "not-started":
				return {
					bgColor: "bg-amber-50",
					borderColor: "border-amber-200",
					icon: <Icon className="w-6 h-6" icon="material-symbols:clock" />,
					subtitle: `Absensi akan dibuka pada ${eventData?.data.startDate} WIB`,
					textColor: "text-amber-700",
					title: "Absensi Belum Dimulai",
				};
			case "ended":
				return {
					bgColor: "bg-red-50",
					borderColor: "border-red-200",
					icon: <Icon className="w-6 h-6" icon="material-symbols:cancel" />,
					subtitle: `Waktu absensi berakhir pada ${eventData?.data.endDate} WIB`,
					textColor: "text-red-700",
					title: "Absensi Telah Ditutup",
				};
			default:
				return {
					bgColor: "bg-green-50",
					borderColor: "border-green-200",
					icon: (
						<Icon className="w-6 h-6" icon="material-symbols:check_circle" />
					),
					subtitle: "Silakan pilih peserta yang Izin",
					textColor: "text-green-700",
					title: "Absensi Sedang Berlangsung",
				};
		}
	};

	const statusConfig = getStatusConfig();

	const generusOptions =
		presenceData?.data.map((item) => ({
			isDisabled: item.isDisabled,
			label: `${item.generusName} - ${item.kelompokName}`,
			value: item.generusId,
		})) || [];

	let distance = 0;
	if (geo.coords?.latitude && geo.coords?.longitude && latitude && longitude) {
		distance = calculateDistance(
			latitude,
			longitude,
			geo.coords?.latitude,
			geo.coords?.longitude,
		);
	}

	useEffect(() => {
		if (distance > radius) {
			toast.error("Anda berada di luar radius dari lokasi kegiatan.");
		}
	}, [distance]);

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-2xl mx-auto">
				{/* Header Card */}
				<div className="bg-white rounded-t-2xl shadow-xl overflow-hidden">
					<div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
						<h1 className="font-bold mb-2">{eventData?.data.title}</h1>
						<div className="text-green-100 space-y-1">
							<div className="flex items-center justify-center gap-2">
								<Icon
									className="w-4 h-4"
									icon="material-symbols:calendar-today"
								/>
								<span>{eventData?.data.startDate}</span>
							</div>
							<div>
								{eventData?.data.startDate} - {eventData?.data.endDate} WIB
							</div>
						</div>
					</div>
				</div>

				{/* Content Card */}
				<div className="bg-white rounded-b-2xl shadow-xl p-6 space-y-6">
					{/* Event Status */}
					{isPending ? (
						<div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
							<div className="flex items-center justify-center gap-2 mb-2">
								<span className="font-bold">Loading...</span>
							</div>
						</div>
					) : (
						<div
							className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border-2 rounded-xl p-4 text-center`}
						>
							<div className="flex items-center justify-center gap-2 mb-2">
								{statusConfig.icon}
								<span className="font-bold">{statusConfig.title}</span>
							</div>
							<p className=" opacity-80">{statusConfig.subtitle}</p>
						</div>
					)}

					{/* Location Info */}
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
						<div className="flex items-start gap-2">
							<Icon
								className="w-5 h-5 text-blue-600 mt-0.5"
								icon="material-symbols:location_on"
							/>
							<div>
								<div className="font-semibold text-blue-900">
									Lokasi: {locationData?.results?.[0]?.formatted}
								</div>
							</div>
						</div>
					</div>

					{/* Location Error */}
					{(!geo.isGeolocationAvailable && !geo.isGeolocationEnabled) ||
					distance > radius ? (
						<div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center text-red-700">
							<Icon
								className="w-12 h-12 mx-auto mb-3 text-red-500"
								icon="material-symbols:warning"
							/>
							<div className="font-bold text-lg mb-2">Lokasi Tidak Valid</div>
							<p className=" mb-4">
								Anda berada di luar radius dari lokasi kegiatan. Silakan
								mendekati lokasi acara untuk melakukan absensi.
							</p>
							<button
								className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
								disabled={
									!geo.isGeolocationAvailable || !geo.isGeolocationEnabled
								}
								onClick={geo.getPosition}
								type="button"
							>
								<Icon className={`w-4 h-4`} icon="material-symbols:refresh" />
								Periksa Lokasi Lagi
							</button>
						</div>
					) : (
						eventData?.data.status === "active" && (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
							>
								<div
									className={`space-y-6 transition-opacity ${geo.isGeolocationAvailable && geo.isGeolocationEnabled ? "" : "opacity-50 pointer-events-none"}`}
								>
									<div className="bg-gray-50 rounded-xl p-6">
										<h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
											<Icon
												className="w-5 h-5"
												icon="material-symbols:people"
											/>
											Pilih Peserta Izin
										</h2>
										<form.Field name="generusId">
											{(field) => (
												<CustomSelect
													label="Pilih Peserta"
													onChange={(e) => field.handleChange(e?.value || "")}
													options={generusOptions}
													placeholder="Pilih peserta..."
													value={generusOptions.find(
														(option) => option.value === field.state.value,
													)}
												/>
											)}
										</form.Field>
										<form.Subscribe
											selector={(state) => [
												state.canSubmit,
												state.isSubmitting,
											]}
										>
											{([canSubmit, isSubmitting]) => (
												<Button disabled={!canSubmit} type="submit">
													{isSubmitting ? "Memproses..." : "Kirim"}
												</Button>
											)}
										</form.Subscribe>
									</div>

									{/* Summary */}
									<div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6 text-center">
										<div className="text-purple-100">Total Peserta Izin:</div>
										<div className="text-4xl font-bold mb-2">
											{presenceCount?.data.izin}
										</div>
									</div>
								</div>
							</form>
						)
					)}
				</div>
			</div>
		</div>
	);
}
