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

export default function AbsenPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const utils = api.useUtils();
	const { id } = use(params);
	const {
		data: eventData,
		error,
		isError,
		isPending,
	} = api.event.getOneEventPublic.useQuery({
		id,
	});
	const { mutate } = api.presence.createPresence.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onSuccess: ({ message }) => {
			utils.generus.withKelompok.invalidate();
			utils.event.countGenerus.invalidate();
			toast.success(message);
		},
	});
	const form = useForm({
		defaultValues: {
			generusId: "",
			eventId: id,
			status: "Hadir",
		},
		onSubmit: ({ value }) => {
			mutate({
				generusId: value.generusId,
				eventId: id,
				status: "Hadir",
			});
		},
	});
	const { data: presenceData } = api.generus.withKelompok.useQuery({
		id,
	});
	const { data: presenceCount } = api.event.countGenerus.useQuery({
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

	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError, error]);

	const getStatusConfig = () => {
		switch (eventData?.data.status) {
			case "not-started":
				return {
					icon: <Icon icon="material-symbols:clock" className="w-6 h-6" />,
					title: "Absensi Belum Dimulai",
					subtitle: `Absensi akan dibuka pada ${eventData?.data.startDate} WIB`,
					bgColor: "bg-amber-50",
					textColor: "text-amber-700",
					borderColor: "border-amber-200",
				};
			case "ended":
				return {
					icon: <Icon icon="material-symbols:cancel" className="w-6 h-6" />,
					title: "Absensi Telah Ditutup",
					subtitle: `Waktu absensi berakhir pada ${eventData?.data.endDate} WIB`,
					bgColor: "bg-red-50",
					textColor: "text-red-700",
					borderColor: "border-red-200",
				};
			default:
				return {
					icon: (
						<Icon icon="material-symbols:check_circle" className="w-6 h-6" />
					),
					title: "Absensi Sedang Berlangsung",
					subtitle: "Silakan pilih peserta yang hadir",
					bgColor: "bg-green-50",
					textColor: "text-green-700",
					borderColor: "border-green-200",
				};
		}
	};

	const statusConfig = getStatusConfig();

	const generusOptions =
		presenceData?.data.map((item) => ({
			value: item.generusId,
			label: `${item.generusName} - ${item.kelompokName}`,
			isDisabled: item.isDisabled,
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
						<h1 className="text-2xl md:text-3xl font-bold mb-2">
							{eventData?.data.title}
						</h1>
						<div className="text-green-100 space-y-1">
							<div className="flex items-center justify-center gap-2">
								<Icon
									icon="material-symbols:calendar-today"
									className="w-4 h-4"
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
								<span className="font-bold text-lg">Loading...</span>
							</div>
						</div>
					) : (
						<div
							className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border-2 rounded-xl p-4 text-center`}
						>
							<div className="flex items-center justify-center gap-2 mb-2">
								{statusConfig.icon}
								<span className="font-bold text-lg">{statusConfig.title}</span>
							</div>
							<p className="text-sm opacity-80">{statusConfig.subtitle}</p>
						</div>
					)}

					{/* Location Info */}
					<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
						<div className="flex items-start gap-2">
							<Icon
								icon="material-symbols:location_on"
								className="w-5 h-5 text-blue-600 mt-0.5"
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
								icon="material-symbols:warning"
								className="w-12 h-12 mx-auto mb-3 text-red-500"
							/>
							<div className="font-bold text-lg mb-2">Lokasi Tidak Valid</div>
							<p className="text-sm mb-4">
								Anda berada di luar radius dari lokasi kegiatan. Silakan
								mendekati lokasi acara untuk melakukan absensi.
							</p>
							<button
								type="button"
								onClick={geo.getPosition}
								className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
								disabled={
									!geo.isGeolocationAvailable || !geo.isGeolocationEnabled
								}
							>
								<Icon icon="material-symbols:refresh" className={`w-4 h-4`} />
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
										<h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
											<Icon
												icon="material-symbols:people"
												className="w-5 h-5"
											/>
											Pilih Peserta Hadir
										</h2>
										<form.Field name="generusId">
											{(field) => (
												<CustomSelect
													label={field.name}
													options={generusOptions}
													onChange={(e) => field.handleChange(e?.value || "")}
													value={generusOptions.find(
														(option) => option.value === field.state.value,
													)}
													required={true}
													placeholder="Pilih peserta..."
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
												<Button type="submit" disabled={!canSubmit}>
													{isSubmitting ? "Memproses..." : "Kirim"}
												</Button>
											)}
										</form.Subscribe>
									</div>

									{/* Summary */}
									<div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl p-6 text-center">
										<div className="text-purple-100">Total Peserta Hadir:</div>
										<div className="text-4xl font-bold mb-2">
											{presenceCount?.data?.hadir}
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
