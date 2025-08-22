import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { type EventSelect, eventUpdateSchema } from "@/types/event";

export default function SheetUpdateEvent({
	closeSheet,
	selectedData,
}: {
	closeSheet: () => void;
	selectedData: EventSelect;
}) {
	const utils = api.useUtils();

	const { mutateAsync, error, data } = api.event.updateEvent.useMutation({
		onSuccess: () => {
			utils.event.getAllPaginated.invalidate();
			closeSheet();
		},
	});

	const form = useForm({
		defaultValues: {
			description: selectedData.description,
			endDate: selectedData.endDate,
			id: selectedData.id,
			latitude: selectedData.latitude,
			longitude: selectedData.longitude,
			startDate: selectedData.startDate,
			title: selectedData.title,
		},
		onSubmit: ({ value }) => {
			toast.promise(mutateAsync(value), {
				error: error?.message,
				loading: "Loading...",
				success: data?.message,
			});
			closeSheet();
		},
		validators: {
			onSubmit: eventUpdateSchema,
		},
	});

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className=" font-bold mb-6 text-gray-800">Update Event</h1>

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
										value={field.state.value || ""}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>
						<form.Field name="latitude">
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
						</form.Field>

						<form.Field name="description">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Description"
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
	);
}
