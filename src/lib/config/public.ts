import { env } from '$env/dynamic/public';
import { z } from 'zod';
import { getConfig } from './getConfig';

const schema = z.object({
	PUBLIC_VERSION: z.optional(z.string()),
	PUBLIC_SHA: z.optional(z.string()),
	PUBLIC_OIDC_AUTHORITY: z.string(),
	PUBLIC_OIDC_CLIENT_ID: z.string(),
	PUBLIC_DEFAULT_LOCALE: z.string().default('de'),
	PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE: z.string().optional(),
	PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE: z.string().optional(),
	PUBLIC_CONTACT_EMAIL: z.string().optional(),
	// AI mode: "local" = WebLLM only, "backend" = server only, "auto" = prefer backend, fall back to local
	PUBLIC_AI_MODE: z.enum(['local', 'backend', 'auto']).optional().default('auto')
});

export const configPublic = getConfig({ schema, envSource: env });
