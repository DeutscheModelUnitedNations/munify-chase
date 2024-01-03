import type { Config } from "drizzle-kit";
import { appConfiguration } from "./src/config/config";

export default ({
  schema: "./db/schema",
  out: "./db/generated",
  driver: "pg",
  dbCredentials: {
    connectionString: appConfiguration.db.postgresUrl,
  },
} satisfies Config);
