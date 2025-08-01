import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { roleOptions } from "@/constants";
import { api } from "@/trpc/react";
import { defaultValueUser, userCreateSchema } from "@/types/user";
import Button from "../../ui/Button";
import Select from "../../ui/Select";

export default function SheetCreateUser({
	closeSheet,
}: {
	closeSheet: () => void;
}) {
	const utils = api.useUtils();

	const { mutate } = api.user.createUser.useMutation({
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
		defaultValues: defaultValueUser,
		onSubmit: ({ value }) => {
			mutate(value);
		},
		validators: {
			onSubmit: userCreateSchema,
		},
	});

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className="text-2xl font-bold mb-6 text-gray-800">
					Buat Data User
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
								<Button type="submit" disabled={!canSubmit}>
									{isSubmitting ? "Memproses..." : "Submit"}
								</Button>
							)}
						</form.Subscribe>
						<Button
							type="button"
							onClick={closeSheet}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
						>
							Close
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
