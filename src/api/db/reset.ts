import { drizzle } from "drizzle-orm/node-postgres";
import { reset } from "drizzle-seed";
import * as schema from "./schema";

const db = drizzle(process.env.DATABASE_URL!, {
  schema: schema,
  casing: "snake_case",
});

console.info("Resetting database...");
await reset(db, schema);
console.info("Resetting database done.");
