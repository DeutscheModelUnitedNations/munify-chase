import * as env from '$env/static/public';
import { z } from 'zod';

const schema = z.object({
	PUBLIC_VERSION: z.string().optional(),
	PUBLIC_SHA: z.string().optional(),
	PUBLIC_OIDC_AUTHORITY: z.string(),
	PUBLIC_OIDC_CLIENT_ID: z.string(),
	PUBLIC_DEFAULT_LOCALE: z.string().default('de'),
	PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE: z.string().optional(),
	PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE: z.string().optional(),
	PUBLIC_CONTACT_EMAIL: z.string().optional(),
	PUBLIC_API_URL: z.string().default('https://chase.munify.cloud/api/graphql')
});

export const configPublic = schema.parse(env);
