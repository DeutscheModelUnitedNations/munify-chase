import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { getConfig } from './getConfig';
const schema = z.object({
	DATABASE_URL: z.string(),
	OIDC_CLIENT_SECRET: z.optional(z.string()),
	OIDC_SCOPES: z
		.string()
		.default('openid profile offline_access email phone identity role custom_data'),
	OIDC_ROLE_CLAIM: z.optional(z.string()),
	NODE_ENV: z.union([z.literal('development'), z.literal('production'), z.literal('test')]),
	// TODO
	OTEL_SERVICE_NAME: z.string().default('MUNIFY-CHASE'),
	OTEL_SERVICE_VERSION: z.optional(z.string()),
	OTEL_ENDPOINT_URL: z.optional(z.string()),
	OTEL_AUTHORIZATION_HEADER: z.optional(z.string()),
	ADMIN_EMAIL_WHITELIST: z.string().optional().default(''),
	ADMIN_DOMAIN_WHITELIST: z.string().optional().default(''),
	REDIS_URL: z.string().optional(),
	AI_PROVIDERS: z
		.array(
			z.object({
				model: z.string(),
				apiKey: z.string().optional()
			})
		)
		.optional()
});

export const configPrivate = getConfig({ schema, envSource: env });
