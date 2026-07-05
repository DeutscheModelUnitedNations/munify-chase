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
	// Base URL of the Font Awesome CDN (without trailing slash). The stylesheets
	// under `<base>/css/*.min.css` are loaded from here (see src/app.html).
	PUBLIC_FONTAWESOME_CDN_URL: z
		.string()
		.default('https://cdn.dmun.de/cdn/fontawesome-pro-6.7.2')
		.transform((url) => url.replace(/\/+$/, ''))
});

export const configPublic = getConfig({ schema, envSource: env });
