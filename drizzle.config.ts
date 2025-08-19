import { defineConfig } from "drizzle-kit";

import { env } from "@/env";

export default defineConfig({
	casing: "snake_case",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./src/server/db/schema.ts",
	strict: true,
	tablesFilter: ["absensi-rajawali-t3-drizzle_*"],
});
