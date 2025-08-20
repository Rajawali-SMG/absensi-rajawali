import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { type UserSelect, userUpdatePasswordSchema } from "@/types/user";

export default function SheetUpdateUserPassword({
	closeSheet,
	selectedData,
}: {
	closeSheet: () => void;
	selectedData: UserSelect;
}) {
	const utils = api.useUtils();

	const { mutate } = api.user.updatePasswordUser.useMutation({
		onError: (error) => {
			toast.error(error.message);
		},
		onSuccess: ({ message }) => {
			toast.success(message);
			utils.user.getAllPaginated.invalidate();
			closeSheet();
		},
	});

	const form = useForm({
		defaultValues: {
			confirmPassword: "",
			id: selectedData.id,
			password: "",
		},
		onSubmit: async ({ value }) => {
			mutate(value);
			closeSheet();
		},
		validators: {
			onSubmit: userUpdatePasswordSchema,
		},
	});

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className=" font-bold mb-6 text-gray-800">Update User</h1>

				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="space-y-4">
						<form.Field name="password">
							{(field) => (
								<>
									<Input
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										htmlFor={field.name}
										id={field.name}
										label="Password"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										required={true}
										type="password"
										value={field.state.value}
										variant="secondary"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>

						<form.Field name="confirmPassword">
							{(field) => (
								<>
									<Input
										className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
										htmlFor={field.name}
										id={field.name}
										label="Konfirmasi Password"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="John Doe"
										required={true}
										type="password"
										value={field.state.value}
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
