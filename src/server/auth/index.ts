import { hash, verify } from "argon2";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";

export const auth = betterAuth({
	appName: "Website Absensi Rajawali",
	database: drizzleAdapter(db, { provider: "pg" }),
	emailAndPassword: {
		disableSignUp: false,
		enabled: true,
		maxPasswordLength: 100,
		minPasswordLength: 8,
		password: {
			hash: hash,
			verify: (data) => verify(data.hash, data.password),
		},
		requireEmailVerification: false,
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	user: {
		additionalFields: {
			role: {
				defaultValue: "Admin",
				type: "string",
			},
		},
		changeEmail: {
			enabled: true,
		},
	},
});
