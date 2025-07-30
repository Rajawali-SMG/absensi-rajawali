// scripts/nuke-db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";

async function nukeDatabase() {
	const client = postgres(env.DATABASE_URL);
	const db = drizzle(client);

	try {
		console.log("🚨 Starting database nuke operation...");

		// Get all tables with your prefix
		const tablesResult = await client`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename LIKE 'absensi-rajawali_%'
    `;

		// Get all enums in the database
		const enumsResult = await client`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e'
    `;

		// Drop all tables
		if (tablesResult.length > 0) {
			console.log(`📋 Found ${tablesResult.length} tables to drop:`);

			for (const table of tablesResult) {
				console.log(`  - ${table.tablename}`);
			}

			// Drop all tables at once with CASCADE to handle foreign key constraints
			const tableNames = tablesResult.map((t) => `"${t.tablename}"`).join(", ");
			await client.unsafe(`DROP TABLE IF EXISTS ${tableNames} CASCADE`);

			console.log("✅ All tables dropped successfully!");
		} else {
			console.log("📋 No tables found with prefix 'absensi-rajawali_'");
		}

		// Drop all enums
		if (enumsResult.length > 0) {
			console.log(`🔢 Found ${enumsResult.length} enums to drop:`);

			for (const enumType of enumsResult) {
				console.log(`  - ${enumType.typname}`);
				try {
					await client.unsafe(
						`DROP TYPE IF EXISTS "${enumType.typname}" CASCADE`,
					);
				} catch (error) {
					console.warn(
						`⚠️  Warning: Could not drop enum ${enumType.typname}:`,
						error,
					);
				}
			}

			console.log("✅ All enums dropped successfully!");
		} else {
			console.log("🔢 No custom enums found");
		}

		// Also drop the drizzle migrations table if it exists
		await client`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE`;
		console.log("🗃️  Drizzle migrations table dropped");

		console.log("💥 Database nuke completed successfully!");
	} catch (error) {
		console.error("❌ Error during database nuke:", error);
		throw error;
	} finally {
		await client.end();
	}
}

// Alternative version that drops ALL tables and enums (use with extreme caution)
async function nukeAllDatabase() {
	const client = postgres(env.DATABASE_URL);

	try {
		console.log("🚨🚨 DANGER: Starting COMPLETE database nuke operation...");
		console.log("This will drop ALL tables and enums in the database!");

		// Get ALL tables in public schema
		const tablesResult = await client`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
    `;

		// Get ALL enums
		const enumsResult = await client`
      SELECT typname
      FROM pg_type
      WHERE typtype = 'e'
    `;

		// Drop all tables
		if (tablesResult.length > 0) {
			console.log(`📋 Dropping ${tablesResult.length} tables...`);
			const tableNames = tablesResult.map((t) => `"${t.tablename}"`).join(", ");
			await client.unsafe(`DROP TABLE IF EXISTS ${tableNames} CASCADE`);
			console.log("✅ All tables dropped!");
		}

		// Drop all enums
		if (enumsResult.length > 0) {
			console.log(`🔢 Dropping ${enumsResult.length} enums...`);
			for (const enumType of enumsResult) {
				await client.unsafe(
					`DROP TYPE IF EXISTS "${enumType.typname}" CASCADE`,
				);
			}
			console.log("✅ All enums dropped!");
		}

		console.log("💥💥 COMPLETE database nuke completed!");
	} catch (error) {
		console.error("❌ Error during complete database nuke:", error);
		throw error;
	} finally {
		await client.end();
	}
}

// Run the appropriate function based on command line argument
const args = process.argv.slice(2);
const nukeAll = args.includes("--all");

if (nukeAll) {
	console.log("⚠️  WARNING: You are about to nuke ALL tables and enums!");
	console.log("⚠️  This action is irreversible!");
	console.log("⚠️  Press Ctrl+C to cancel, or wait 5 seconds to continue...");

	setTimeout(() => {
		nukeAllDatabase().catch(console.error);
	}, 5000);
} else {
	nukeDatabase().catch(console.error);
}
