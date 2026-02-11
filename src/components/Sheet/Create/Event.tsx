import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { eventCreateSchema, eventDefaultValue } from "@/types/event";
import dynamic from "next/dynamic";

export default function SheetCreateEvent({
	closeSheet,
}: {
	closeSheet: () => void;
}) {
	const utils = api.useUtils();

	const MapPicker = dynamic(() => import("@/components/MapPicker"), {
		ssr: false,
	});

	const { mutate } = api.event.createEvent.useMutation({
		onError: ({ message }) => {
			toast.dismiss();
			toast.error(message);
		},
		onMutate: () => {
			toast.loading("Loading...");
		},
		onSuccess: ({ message }) => {
			utils.event.invalidate();
			toast.dismiss();
			toast.success(message);
			closeSheet();
		},
	});

	const form = useForm({
		defaultValues: eventDefaultValue,
			onSubmit: ({ value }) => {
				// Normalize datetime-local (local wall time without timezone) to ISO string (UTC)
				const payload = {
					...value,
					startDate: value.startDate ? new Date(value.startDate).toISOString() : value.startDate,
					endDate: value.endDate ? new Date(value.endDate).toISOString() : value.endDate,
				};

				mutate(payload);
			},
		validators: {
			onSubmit: eventCreateSchema,
		},
	});

	return (
		<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
			<div className="flex min-h-screen items-start justify-center p-4">
				<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className=" font-bold mb-6 text-gray-800">Buat Data Event</h1>

				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="space-y-4">
						<form.Field name="title">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Title"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										type="text"
										value={field.state.value}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="startDate">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Start Date"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										type="datetime-local"
										value={field.state.value}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="endDate">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="End Date"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										type="datetime-local"
										value={field.state.value}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>
						{/* <form.Field name="latitude">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Latitude"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										placeholder="John Doe"
										type="number"
										value={field.state.value || ""}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="longitude">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Longitude"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										placeholder="John Doe"
										type="number"
										value={field.state.value || ""}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field> */}

						{/* Map Picker */}
						<form.Field name="latitude">
							{(latField) => (
								<form.Field name="longitude">
								{(lngField) => (
									<>
									<label className="text-sm font-medium">Lokasi Event</label>

									<MapPicker
										lat={latField.state.value}
										lng={lngField.state.value}
										onChange={(lat, lng) => {
										latField.handleChange(lat);
										lngField.handleChange(lng);
										}}
									/>

									<div className="grid grid-cols-2 gap-2 mt-2">
										<Input
										label="Latitude"
										type="number"
										value={latField.state.value || ""}
										readOnly
										variant="secondary"
										/>
										<Input
										label="Longitude"
										type="number"
										value={lngField.state.value || ""}
										readOnly
										variant="secondary"
										/>
									</div>

									<TextError field={latField} />
									<TextError field={lngField} />
									</>
								)}
								</form.Field>
							)}
						</form.Field>


						<form.Field name="description">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Deskripsi"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										required={false}
										type="text"
										value={field.state.value || ""}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>
					</div>

					<div className="flex justify-end space-x-4 mt-6">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<button
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
									disabled={!canSubmit}
									type="submit"
								>
									{isSubmitting ? "Memproses..." : "Update"}
								</button>
							)}
						</form.Subscribe>

						<button
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
							onClick={closeSheet}
							type="button"
						>
							Close
						</button>
					</div>
				</form>
			</div>
				</div>
			</div>
		</div>
	);
}
