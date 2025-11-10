import { rumble } from "@m1212e/rumble";
import { dev } from "$app/environment";
import { context } from "./context";
import { db } from "./db/db";

// this tells the dev server to reload the cache of the schema builder to prevent buildup of non
// existent fields/queries
if (dev) {
  import("$api/handlers/register");
}

export const {
  abilityBuilder,
  schemaBuilder,
  object,
  query,
  pubsub,
  createYoga,
  enum_,
  clientCreator,
  orderArg,
  whereArg,
  countQuery,
} = rumble({
  db,
  context,
  defaultLimit: 300,
});
