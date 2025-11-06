import { z } from "zod/v4";
import { importDataSchema } from "$lib/utils/import";
import type { RequestHandler } from "./$types";

export const GET = (async () => {
  return new Response(
    JSON.stringify(z.toJSONSchema(importDataSchema), null, 2),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}) satisfies RequestHandler;
