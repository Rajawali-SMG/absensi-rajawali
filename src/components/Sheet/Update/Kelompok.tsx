import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { type KelompokSelect, kelompokUpdateSchema } from "@/types/kelompok";
import Select from "../../ui/Select";

export default function SheetUpdateKelompok({
	closeSheet,
	selectedData,
}: {
	closeSheet: () => void;
	selectedData: KelompokSelect;
}) {
	const utils = api.useUtils();
	const { data } = api.desa.getAll.useQuery();
	const { mutate } = api.kelompok.updateKelompok.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onSuccess: ({ message }) => {
			utils.kelompok.getAllPaginated.invalidate();
			toast.success(message);
		},
	});

	const form = useForm({
		defaultValues: {
			desaId: selectedData.desaId,
			id: selectedData.id,
			nama: selectedData.nama,
		},
		onSubmit: ({ value }) => {
			mutate(value);
			closeSheet();
		},
		validators: {
			onSubmit: kelompokUpdateSchema,
		},
	});

	const desaOptions =
		data?.data.map((item) => ({
			label: item.nama,
			value: item.id,
		})) || [];

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">Update User</h1>

				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="space-y-4">
						<form.Field name="id">
							{(field) => (
								<>
									<Input
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										htmlFor={field.name}
										id={field.name}
										label="ID"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="KGR"
										required={true}
										type="text"
										value={field.state.value}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="nama">
							{(field) => (
								<>
									<Input
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										htmlFor={field.name}
										id={field.name}
										label="Nama"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										required={true}
										type="text"
										value={field.state.value}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="desaId">
							{(field) => (
								<div className="space-y-1">
									<Select
										label="Desa"
										name={field.name}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										options={desaOptions}
										placeholder="Pilih Desa"
										required={true}
										value={field.state.value}
									/>
								</div>
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
