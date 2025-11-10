import { drizzle } from "drizzle-orm/postgres-js";
import { configPrivate } from "$lib/config/private";
import { relations as relationsInternal } from "./relations";
import * as schemaInternal from "./schema";

export const db = drizzle(configPrivate.DATABASE_URL, {
  relations: relationsInternal,
  schema: schemaInternal,
  casing: "snake_case",
});

export const schema = schemaInternal;
export const relations = relationsInternal;
