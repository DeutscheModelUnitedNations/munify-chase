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
 * Every environment variable the app reads, validated when it starts (or builds). Import them by
 * name from `$app/env/private` (server only) or `$app/env/public` (also the browser).
 */
export const variables = defineEnvVars({
	// --- Private ---
	DATABASE_URL: {
		description:
			'Postgres connection string, e.g. postgres://postgres:postgres@localhost:5432/postgres',
		schema: requiredAtRuntime(z.string(), '')
	},
	NODE_ENV: {
		description:
			'Runtime mode, set by the dev server and the Docker image. Read by libraries, not by the app',
		schema: requiredAtRuntime(
			z.union([z.literal('development'), z.literal('production'), z.literal('test')]),
			'production'
		)
	},
	OIDC_CLIENT_SECRET: {
		description: 'OAuth2 client secret, required for confidential clients such as Logto',
		schema: z.string().optional()
	},
	OIDC_SCOPES: {
		description: 'Space-separated scopes requested from the OIDC provider',
		schema: z
			.string()
			.default('openid profile offline_access email phone identity role custom_data')
	},
	OIDC_ROLE_CLAIM: {
		description: 'Path of the JWT claim that holds the user roles, e.g. `roles` for Logto',
		schema: z.string().optional()
	},
	OTEL_SERVICE_NAME: {
		description: 'OpenTelemetry service name. Not wired up yet',
		schema: z.string().default('MUNIFY-CHASE')
	},
	OTEL_SERVICE_VERSION: {
		description: 'OpenTelemetry service version. Not wired up yet',
		schema: z.string().optional()
	},
	OTEL_ENDPOINT_URL: {
		description: 'OpenTelemetry collector endpoint. Not wired up yet',
		schema: z.string().optional()
	},
	OTEL_AUTHORIZATION_HEADER: {
		description: 'Authorization header sent to the OpenTelemetry collector. Not wired up yet',
		schema: z.string().optional()
	},
	ADMIN_EMAIL_WHITELIST: {
		description: 'Comma-separated emails that are global admins',
		schema: z.string().default('')
	},
	ADMIN_DOMAIN_WHITELIST: {
		description: 'Comma-separated email domains whose users are global admins',
		schema: z.string().default('')
	},
	REDIS_URL: {
		description:
			'Redis connection string. When set, GraphQL subscriptions are shared across instances via Redis pub/sub',
		schema: z.string().optional()
	},
	// same semantics as the node adapter: forwarded headers are only trusted
	// when explicitly configured
	ORIGIN: {
		description:
			'Public origin of the app (e.g. https://chase.munify.cloud), used to authenticate WebSocket connections. Takes precedence over the forwarded headers below there. The HTTP server (adapter-node 6) ignores it and derives the origin from the headers instead',
		schema: z.string().optional()
	},
	PROTOCOL_HEADER: {
		description:
			'Header holding the original protocol behind a reverse proxy, e.g. x-forwarded-proto. Only trusted when set',
		schema: z.string().optional()
	},
	HOST_HEADER: {
		description:
			'Header holding the original host behind a reverse proxy, e.g. x-forwarded-host. Only trusted when set',
		schema: z.string().optional()
	},
	PORT_HEADER: {
		description:
			'Header holding the original port behind a reverse proxy, e.g. x-forwarded-port. Only trusted when set',
		schema: z.string().optional()
	},
	AI_PROVIDERS: {
		description:
			'JSON array of server-side AI providers, `[{ "model": "<provider>/<model>", "apiKey"?, "baseURL"? }]`, used in round-robin with failover. Without it chairs only get local in-browser AI. See .env.example',
		schema: z
			.string()
			.optional()
			.transform((value) => (value ? JSON.parse(value) : undefined))
			.pipe(
				z
					.array(
						z.object({
							model: z.string(),
							apiKey: z.string().optional(),
							baseURL: z.string().optional()
						})
					)
					.optional()
			)
	},

	// --- Public ---
	PUBLIC_VERSION: {
		description: 'App version shown in the UI, set by the Docker build',
		public: true,
		schema: z.string().optional()
	},
	PUBLIC_SHA: {
		description: 'Git commit shown in the UI, set by the Docker build',
		public: true,
		schema: z.string().optional()
	},
	PUBLIC_OIDC_AUTHORITY: {
		description:
			'Full OIDC discovery URL (\u2026/.well-known/openid-configuration). Locally the mock at http://127.0.0.1:8090/oidc/.well-known/openid-configuration',
		public: true,
		schema: requiredAtRuntime(z.string(), '')
	},
	PUBLIC_OIDC_CLIENT_ID: {
		description: 'OAuth2 client ID registered with the OIDC provider',
		public: true,
		schema: requiredAtRuntime(z.string(), '')
	},
	PUBLIC_DEFAULT_LOCALE: {
		description: 'Locale for users whose OIDC profile has none',
		public: true,
		schema: z.string().default('de')
	},
	PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE: {
		description: 'Overrides the route the OIDC provider redirects to after login',
		public: true,
		schema: z.string().optional()
	},
	PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE: {
		description: 'Overrides the route the OIDC provider redirects to after logout',
		public: true,
		schema: z.string().optional()
	},
	PUBLIC_CONTACT_EMAIL: {
		description: 'Contact email shown on the landing page for conference organizers',
		public: true,
		schema: z.string().default('vorstand@dmun.de')
	}
});
