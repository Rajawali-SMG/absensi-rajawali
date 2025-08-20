"use client";

import { useForm } from "@tanstack/react-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import TextError from "@/components/TextError";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn } from "@/server/auth/auth-client";
import { loginSchema } from "@/types/auth";

export default function LoginPage() {
	const navigate = useRouter();
	async function login(value: { email: string; password: string }) {
		return await signIn.email(value, {
			onError: ({ error }) => {
				toast.error(error.message);
			},
			onSuccess: () => {
				navigate.push("/admin/dashboard");
				toast.success("Berhasil login");
			},
		});
	}
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: ({ value }) => {
			login(value);
		},
		validators: {
			onChange: loginSchema,
		},
	});

	return (
		<div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
			<Image
				alt="Logo Rajawali"
				className="h-24 mb-10"
				height={200}
				src="/logo-rajawali.png"
				width={200}
			/>
			{/* Card */}
			<div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
				<h2 className="font-bold text-gray-900 dark:text-white">
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
										htmlFor={field.name}
										id={field.name}
										label="Email"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="JohnDoe"
										required={true}
										type="text"
										value={field.state.value}
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
										className="flex-1"
										htmlFor={field.name}
										id={field.name}
										label="Password"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Password"
										required={true}
										type="password"
										value={field.state.value}
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
							<Button disabled={!canSubmit} type="submit">
								{isSubmitting ? "Memproses..." : "Masuk"}
							</Button>
						)}
					</form.Subscribe>
				</form>
			</div>
		</div>
	);
}
