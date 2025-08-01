import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { roleOptions } from "@/constants";
import { api } from "@/trpc/react";
import { type UserSelect, userUpdateSchema } from "@/types/user";

export default function SheetUpdateUser({
	closeSheet,
	selectedData,
}: {
	closeSheet: () => void;
	selectedData: UserSelect;
}) {
	const utils = api.useUtils();

	const { mutate } = api.user.updateUser.useMutation({
		onError: (error) => {
			toast.error(error.message);
		},

		onSuccess: (data) => {
			utils.user.getAllPaginated.invalidate();
			toast.success(data.message);
			closeSheet();
		},
	});

	const form = useForm({
		defaultValues: {
			id: selectedData.id,
			username: selectedData.username,
			password: "",
			role: selectedData.role,
		},
		onSubmit: ({ value }) => {
			mutate(value);
			closeSheet();
		},
		validators: {
			onSubmit: userUpdateSchema,
		},
	});

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">Update User</h1>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<div className="space-y-4">
						<form.Field name="username">
							{(field) => (
								<>
									<Input
										label="Username"
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

						<form.Field name="password">
							{(field) => (
								<>
									<Input
										label="Password"
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

						<form.Field name="role">
							{(field) => (
								<div className="space-y-1">
									<Select
										name={field.name}
										label="Role"
										options={roleOptions}
										placeholder="Pilih Role"
										value={field.state.value}
										onChange={(e) =>
											field.handleChange(
												e.target.value as typeof field.state.value,
											)
										}
										required={true}
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
									{isSubmitting ? "Memproses..." : "Update"}
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
