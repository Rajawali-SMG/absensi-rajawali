"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "@tanstack/react-form";
import { use } from "react";
import toast from "react-hot-toast";
import CustomSelect from "@/components/CustomSelect";
import Button from "@/components/ui/Button";
import { api } from "@/trpc/react";
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
	} = api.event.getOneEventPublic.useQuery(
		{
			id,
		},
		{
			enabled: !!id,
		},
	);
	const { mutate } = api.presence.createPresence.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onMutate: () => {
			toast.loading("Loading...");
		},
		onSuccess: ({ message }) => {
			utils.generus.withKelompok.invalidate();
			utils.event.countGenerus.invalidate();
			toast.dismiss();
			toast.success(message);
		},
	});
	const form = useForm({
		defaultValues: {
			eventId: id,
			generusId: "",
			generusName: "",
			status: "Izin",
		},
		onSubmit: ({ value }) => {
			mutate({
				eventId: id,
				generusId: value.generusId,
				generusName: value.generusName,
				status: "Izin",
			});
		},
	});
	const { data: presenceData, error: presenceError } =
		api.generus.withKelompok.useQuery(
			{
				id,
			},
			{
				enabled: eventData?.data.status === "active",
			},
		);
	const { data: presenceCount, error: presenceCountError } =
		api.event.countGenerus.useQuery(
			{
				id,
			},
			{
				enabled: eventData?.data.status === "active",
			},
		);

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

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-2xl mx-auto">
				{/* Header Card */}
				<div className="bg-white rounded-t-2xl shadow-xl overflow-hidden">
					<div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
						<h1 className="font-bold mb-2">{eventData?.data.title}</h1>
						<div className="text-green-100 space-y-1">
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

					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<div className="space-y-6">
							<div className="bg-gray-50 rounded-xl p-6">
								<h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
									<Icon className="w-5 h-5" icon="material-symbols:people" />
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
									selector={(state) => [state.canSubmit, state.isSubmitting]}
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
				</div>
			</div>
		</div>
	);
}
