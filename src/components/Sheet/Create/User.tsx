import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { defaultValueUser, userCreateSchema } from "@/types/user";
import Button from "../../ui/Button";

export default function SheetCreateUser({
	closeSheet,
}: {
	closeSheet: () => void;
}) {
	const utils = api.useUtils();

	const { mutate } = api.user.createUser.useMutation({
		onError: ({ message }) => {
			toast.dismiss();
			toast.error(message);
		},
		onMutate: () => {
			toast.loading("Loading...");
		},
		onSuccess: ({ message }) => {
			utils.user.invalidate();
			toast.dismiss();
			toast.success(message);
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
		<div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transform transition-transform duration-300">
			<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
				<h1 className=" font-bold mb-6 text-gray-800">Buat Data User</h1>

				<form
					className="space-y-4"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div className="space-y-4">
						<form.Field name="name">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Nama"
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

						<form.Field name="email">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Email"
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

						<form.Field name="password">
							{(field) => (
								<>
									<Input
										id={field.name}
										label="Password"
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Really Strong Password"
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
								<Button disabled={!canSubmit} type="submit">
									{isSubmitting ? "Memproses..." : "Submit"}
								</Button>
							)}
						</form.Subscribe>
						<Button
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
							onClick={closeSheet}
							type="button"
						>
							Close
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
