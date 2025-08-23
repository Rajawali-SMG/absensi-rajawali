import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
import { env } from "@/env";

export const {
	signIn,
	signOut,
	signUp,
	updateUser,
	changeEmail,
	changePassword,
} = createAuthClient({
	baseURL: env.NEXT_PUBLIC_BASE_URL,
	plugins: [adminClient()],
});
