import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import path from "path";
console.log("---------------------------------------------------")
console.log('DB URL loaded:', process.env.DATABASE_URL ? `Loaded ${process.env.DATABASE_URL}` : 'MISSING');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // will point to Cloud SQL
});

const db = drizzle(pool);

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: path.resolve("drizzle") });
  console.log("Done!");
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
