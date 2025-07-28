import { useForm } from "@tanstack/react-form";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { kelompokCreateSchema, kelompokDefaultValue } from "@/types/kelompok";
import { useAlert } from "@/utils/useAlert";
import Select from "../../ui/Select";

export default function SheetCreateKelompok({
	closeSheet,
}: {
	closeSheet: () => void;
}) {
	const { setAlert } = useAlert();
	const utils = api.useUtils();
	const { data } = api.desa.getAll.useQuery();
	const { mutate } = api.kelompok.createKelompok.useMutation({
		onError: ({ message }) => {
			setAlert(message, "error");
		},
		onSuccess: ({ message }) => {
			utils.kelompok.getAllPaginated.invalidate();
			setAlert(message, "success");
			closeSheet();
		},
	});

	const form = useForm({
		defaultValues: kelompokDefaultValue,
		onSubmit: ({ value }) => {
			mutate(value);
		},
		validators: {
			onSubmit: kelompokCreateSchema,
		},
	});

	const desaOptions =
		data?.data?.items.map((item) => ({
			value: item.id,
			label: item.nama,
		})) || [];

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">
					Create Kelompok
				</h1>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<div className="space-y-4">
						<form.Field name="id">
							{(field) => (
								<>
									<Input
										label="ID"
										variant="secondary"
										htmlFor={field.name}
										type="text"
										name={field.name}
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="KGR"
										required={true}
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="nama">
							{(field) => (
								<>
									<Input
										label="Nama"
										variant="secondary"
										htmlFor={field.name}
										type="text"
										name={field.name}
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										required={true}
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="desa_id">
							{(field) => (
								<div className="space-y-1">
									<Select
										name={field.name}
										label="Desa"
										options={desaOptions}
										placeholder="Pilih Desa"
										required={true}
										value={field.state.value}
										onChange={(e) => field.handleChange(Number(e.target.value))}
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
									type="submit"
									disabled={!canSubmit}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
								>
									{isSubmitting ? "Memproses..." : "Buat"}
								</button>
							)}
						</form.Subscribe>

						<button
							type="button"
							onClick={closeSheet}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
						>
							Close
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
