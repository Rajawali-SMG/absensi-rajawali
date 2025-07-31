"use client";

import { useForm } from "@tanstack/react-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TextError from "@/components/TextError";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn } from "@/server/auth/client";
import { api } from "@/trpc/react";
import { loginSchema } from "@/types/auth";
import { useAlert } from "@/utils/useAlert";

export default function LoginPage() {
	const navigate = useRouter();
	const { setAlert } = useAlert();
	async function login(value: { email: string; password: string }) {
		return await signIn.email(value, {
			onError: ({ error }) => {
				setAlert(error.message, "error");
			},
			onSuccess: ({ response }) => {
				console.log(response);
				navigate.push("/admin/dashboard");
				setAlert(response.statusText || "Berhasil login", "success");
			},
		});
	}
	// const { mutate } = api.login.login.useMutation();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: ({ value }) => {
			login(value);
			// mutate(value, {
			// 	onSuccess: ({ message }) => {
			// 		setAlert(message, "success");
			// 		navigate.push("/admin/dashboard");
			// 	},
			// 	onError: ({ message }) => {
			// 		setAlert(message, "error");
			// 	},
			// });
		},
		validators: {
			onChange: loginSchema,
		},
	});

	return (
		<div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
			<Image
				src="/logo-rajawali.png"
				width={200}
				height={200}
				className="h-24 mb-10"
				alt="Logo Rajawali"
			/>
			{/* Card */}
			<div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Masuk ke akun Anda
				</h2>
				<form
					className="mt-8 space-y-6"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div>
						<form.Field name="email">
							{(field) => (
								<>
									<Input
										label="Email"
										htmlFor={field.name}
										type="text"
										name={field.name}
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="JohnDoe"
										required={true}
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>
					</div>
					<div>
						<form.Field name="password">
							{(field) => (
								<>
									<Input
										label="Password"
										htmlFor={field.name}
										type="password"
										name={field.name}
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Password"
										required={true}
										className="flex-1"
									/>
									<TextError field={field} />
								</>
							)}
						</form.Field>
					</div>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button type="submit" disabled={!canSubmit}>
								{isSubmitting ? "Memproses..." : "Masuk"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</div>
		</div>
	);
}
