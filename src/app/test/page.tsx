"use client";
import Button from "@/components/ui/Button";
import { signUp } from "@/server/auth/client";

export default function TestPage() {
	// 		email: "test@example.com",
	// 		password: "test1234567",

	return (
		<div>
			<h1>test page</h1>
			<Button
				onClick={() =>
					signUp.email({
						name: "test",
						email: "test@example.com",
						password: "test1234567",
						callbackURL: "/admin/dashboard",
					})
				}
			>
				Daftar
			</Button>
		</div>
	);
}
