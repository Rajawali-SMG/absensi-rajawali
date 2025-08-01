import { createAuthClient } from "better-auth/client";

export const { useSession, signIn, signOut, signUp } = createAuthClient({
	baseURL: "http://localhost:3000",
});
