import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { type DesaSelect, desaUpdateSchema } from "@/types/desa";

export default function SheetUpdateDesa({
	closeSheet,
	selectedData,
}: {
	closeSheet: () => void;
	selectedData: DesaSelect;
}) {
	const utils = api.useUtils();

	const { mutate } = api.desa.updateDesa.useMutation({
		onError: (error) => {
			toast.dismiss();
			toast.error(error.message);
		},
		onMutate({ nama }) {
			toast.loading(`Mengupdate desa ${nama}`);
		},
		onSuccess: ({ message }) => {
			toast.dismiss();
			toast.success(message);
			utils.desa.invalidate();
			closeSheet();
		},
	});

	const form = useForm({
		defaultValues: {
			id: selectedData.id,
			nama: selectedData.nama,
		},
		onSubmit: ({ value }) => {
			mutate(value);
		},
		validators: {
			onSubmit: desaUpdateSchema,
		},
	});

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className=" font-bold mb-6 text-gray-800">
					Update {selectedData.nama}
				</h1>

				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="space-y-4">
						<form.Field name="nama">
							{(field) => (
								<>
									<Input
										autoFocus
										id={field.name}
										label="Nama"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Sendang Mulyo"
										type="text"
										value={field.state.value}
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
