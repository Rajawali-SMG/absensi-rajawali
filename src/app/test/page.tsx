"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/server/auth/client";
import Button from "../../components/ui/Button";

export default async function TestPage() {
	// const signUp = await authClient.signUp.email(
	// 	{
	// 		email: "test@example.com",
	// 		password: "test1234567",
	// 		name: "test",
	// 	},
	// 	{
	// 		onRetry: () => {
	// 			console.log("onRetry");
	// 		},
	// 		onError: () => {
	// 			console.log("onError");
	// 		},
	// 		onSuccess: () => {
	// 			console.log("onSuccess");
	// 		},
	// 	},
	// );

	const router = useRouter();

	const signIn = await authClient.signIn.email(
		{
			email: "test@example.com",
			password: "test1234567",
		},
		{
			onRetry: () => {
				router.push("/test");
			},
			onError: () => {
				router.push("/error");
			},
			onSuccess: () => {
				router.push("/admin/dashboard");
			},
		},
	);

	return (
		<div>
			<h1>test page</h1>
			{/* <Button type="button" onClick={() => signUp}>
				Sign Up
			</Button> */}
			<Button onClick={() => signIn}>Sign In</Button>
		</div>
	);
}
