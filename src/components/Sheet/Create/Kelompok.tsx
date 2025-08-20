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
			label: item.nama,
			value: String(item.id),
		})) || [];

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className=" font-bold mb-6 text-gray-800">Create Kelompok</h1>

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

						<form.Field name="code">
							{(field) => (
								<>
									<Input
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										htmlFor={field.name}
										id={field.name}
										label="Kode"
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
									<CustomSelect
										isLoading={desaIsLoading}
										label="Desa"
										onChange={(option) => {
											field.handleChange(option?.value || "");
											console.log(option);
										}}
										options={desaOptions}
										value={
											desaOptions.find(
												(option) => option.value === field.state.value,
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
										className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
										disabled={!canSubmit}
										type="submit"
									>
										{isSubmitting ? "Memproses..." : "Buat"}
									</button>
								);
							}}
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
