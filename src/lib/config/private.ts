import { nanoid } from "nanoid";
import { z } from "zod";
import { env } from "$env/dynamic/private";
import { getConfig } from "./getConfig";

const schema = z.object({
  DATABASE_URL: z.string(),
  OIDC_CLIENT_SECRET: z.optional(z.string()),
  OIDC_SCOPES: z
    .string()
    .default(
      "openid profile offline_access address email family_name gender given_name locale name phone preferred_username urn:zitadel:iam:org:projects:roles urn:zitadel:iam:user:metadata",
    ),
  OIDC_ROLE_CLAIM: z.optional(z.string()),
  SECRET: z.string().default(nanoid(50)),
  NODE_ENV: z.union([
    z.literal("development"),
    z.literal("production"),
    z.literal("test"),
  ]),
  // TODO
  OTEL_SERVICE_NAME: z.string().default("MUNIFY-CHASE"),
  OTEL_SERVICE_VERSION: z.optional(z.string()),
  OTEL_ENDPOINT_URL: z.optional(z.string()),
  OTEL_AUTHORIZATION_HEADER: z.optional(z.string()),
});

export const configPrivate = getConfig({ schema, envSource: env });
