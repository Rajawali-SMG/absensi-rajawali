import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { kelompokCreateSchema, kelompokDefaultValue } from "@/types/kelompok";
import CustomSelect from "../../CustomSelect";

export default function SheetCreateKelompok({
	closeSheet,
}: {
	closeSheet: () => void;
}) {
	const utils = api.useUtils();
	const { data, isLoading: desaIsLoading } = api.desa.getAll.useQuery();
	const { mutate } = api.kelompok.createKelompok.useMutation({
		onError: ({ message }) => {
			toast.error(message);
		},
		onSuccess: ({ message }) => {
			utils.kelompok.getAllPaginated.invalidate();
			toast.success(message);
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
		data?.data.map((item) => ({
			value: String(item.id),
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
						<form.Field name="code">
							{(field) => (
								<>
									<Input
										label="Kode"
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

						<form.Field name="desaId">
							{(field) => (
								<div className="space-y-1">
									<CustomSelect
										label="Desa"
										options={desaOptions}
										isLoading={desaIsLoading}
										onChange={(option) => {
											field.handleChange(Number(option?.value || ""));
											console.log(option);
										}}
										value={
											desaOptions.find(
												(option) => option.value === String(field.state.value),
											) || null
										}
									/>

									<TextError field={field} />
								</div>
							)}
						</form.Field>
					</div>

					<div className="flex justify-end space-x-4 mt-6">
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => {
								return (
									<button
										type="submit"
										disabled={!canSubmit}
										className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
									>
										{isSubmitting ? "Memproses..." : "Buat"}
									</button>
								);
							}}
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
