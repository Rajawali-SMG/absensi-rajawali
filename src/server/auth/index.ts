import { hash, verify } from "argon2";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	emailAndPassword: {
		enabled: true,
		disableSignUp: false,
		requireEmailVerification: false,
		maxPasswordLength: 100,
		minPasswordLength: 8,
		password: {
			hash: hash,
			verify: (data) => verify(data.hash, data.password),
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	appName: "Website Absensi Rajawali",
	user: {
		changeEmail: {
			enabled: true,
		},
		additionalFields: {
			role: {
				type: "string",
				defaultValue: "Admin",
			},
		},
	},
});
