import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfiguration } from "../src/config/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: appConfiguration.db.postgresUrl,
});

export const db = drizzle(pool, { schema });
await migrate(db, { migrationsFolder: "db/migrations" });
