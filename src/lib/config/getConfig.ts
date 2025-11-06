import type { Schema as ZodSchema, z } from "zod";
import { building } from "$app/environment";
import type { env as envPrivate } from "$env/dynamic/private";
import type { env as envPublic } from "$env/dynamic/public";

/**
 * Parses environment variables into a Zod schema.
 */
export function getConfig<
  Schema extends ZodSchema,
  Source extends typeof envPublic | typeof envPrivate,
>({
  envSource,
  schema,
  disableFallbackProcessEnv = false,
}: {
  schema: Schema;
  envSource: Source;
  disableFallbackProcessEnv?: boolean;
}): z.infer<Schema> {
  if (building) return {} as z.infer<Schema>;
  let err: unknown;
  try {
    return schema.parse(envSource);
  } catch (error) {
    err = error;
  }

  if (disableFallbackProcessEnv) throw err;

  try {
    return schema.parse(process.env);
  } catch (error) {
    // we want to throw the original error
    throw err;
  }
}
