import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

export const {
	useSession,
	signIn,
	signOut,
	signUp,
	updateUser,
	listAccounts,
	changeEmail,
	changePassword,
} = createAuthClient({
	baseURL: "http://localhost:3000",
	plugins: [adminClient()],
});
