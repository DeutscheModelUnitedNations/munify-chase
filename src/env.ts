import { defineEnvVars } from '@sveltejs/kit/env';
import { building } from '$app/env';
import { z } from 'zod';

/**
 * A variable that must be set when the app runs, but not while SvelteKit analyses it during
 * `vite build`, which happens without the deployment's environment.
 */
const requiredAtRuntime = <T extends z.ZodType<unknown, string | undefined>>(
	schema: T,
	placeholder: string
) =>
	z
		.string()
		.optional()
		.transform((value) => (building && value === undefined ? placeholder : value))
		.pipe(schema);

/**
 * Every environment variable the native client reads. There is no server to deliver them at
 * runtime, so all of them are public and static: validated and inlined when the app is built.
 * Import them by name from `$app/env/public`.
 */
export const variables = defineEnvVars({
	// --- Public ---
	PUBLIC_VERSION: {
		description: 'App version shown in the UI, set by the Docker build',
		public: true,
		static: true,
		schema: z.string().optional()
	},
	PUBLIC_SHA: {
		description: 'Git commit shown in the UI, set by the Docker build',
		public: true,
		static: true,
		schema: z.string().optional()
	},
	PUBLIC_OIDC_AUTHORITY: {
		description:
			'Full OIDC discovery URL (\u2026/.well-known/openid-configuration). Locally the mock at http://127.0.0.1:8090/oidc/.well-known/openid-configuration',
		public: true,
		static: true,
		schema: requiredAtRuntime(z.string(), '')
	},
	PUBLIC_OIDC_CLIENT_ID: {
		description: 'OAuth2 client ID registered with the OIDC provider',
		public: true,
		static: true,
		schema: requiredAtRuntime(z.string(), '')
	},
	PUBLIC_DEFAULT_LOCALE: {
		description: 'Locale for users whose OIDC profile has none',
		public: true,
		static: true,
		schema: z.string().default('de')
	},
	PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE: {
		description: 'Overrides the route the OIDC provider redirects to after login',
		public: true,
		static: true,
		schema: z.string().optional()
	},
	PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE: {
		description: 'Overrides the route the OIDC provider redirects to after logout',
		public: true,
		static: true,
		schema: z.string().optional()
	},
	PUBLIC_CONTACT_EMAIL: {
		description: 'Contact email shown on the landing page for conference organizers',
		public: true,
		static: true,
		schema: z.string().default('vorstand@dmun.de')
	},
	PUBLIC_API_URL: {
		description: 'GraphQL endpoint of the CHASE server the native client talks to',
		public: true,
		static: true,
		schema: z.string().default('https://chase.munify.cloud/api/graphql')
	}
});
