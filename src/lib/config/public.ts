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
	// Base URL of the backend API server, e.g. https://chase.munify.cloud
	// Required for Tauri builds; omit in web deployments (uses relative /api paths)
	PUBLIC_API_URL: z.string().optional()
});

export const configPublic = getConfig({ schema, envSource: env });
