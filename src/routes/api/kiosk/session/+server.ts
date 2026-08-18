import { dev } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

/**
 * Bridges a Pi display's OIDC tokens into the standard `@m1212e/sveltekit-oidc`
 * session so `/kiosk` authenticates through the normal `hooks.server.ts` ->
 * `context()` path (no synthetic context).
 *
 * The Pi helper performs the OAuth 2.0 Device Authorization Grant + refresh
 * loop itself. We set only the library's access/id/expires cookies — never the
 * refresh-token cookie — because Logto rotates refresh tokens on use: the
 * helper stays the sole owner of the refresh token and re-seeds this endpoint
 * before the access token expires.
 *
 * Two call styles:
 *  - JSON body  -> 204 (machine-to-machine).
 *  - Form POST  -> 303 redirect to /kiosk?deviceId=... The cookies must land
 *    in Chromium's own jar, which only happens on a top-level browser
 *    navigation, so the Pi's local bootstrap page auto-submits a form here.
 *
 * Cookie names follow the library default prefix `auth_oidc_` (CHASE calls
 * `makeOIDC` without a `cookiePrefix`).
 */
const COOKIE_PREFIX = 'auth_oidc_';

const schema = z.object({
	accessToken: z.string().min(1),
	idToken: z.string().min(1).optional(),
	expiresIn: z.coerce.number().int().positive().optional(),
	deviceId: z.string().min(1).optional()
});

export const POST: RequestHandler = async ({ request, cookies }) => {
	const contentType = request.headers.get('content-type') ?? '';
	const isForm =
		contentType.includes('application/x-www-form-urlencoded') ||
		contentType.includes('multipart/form-data');

	let input: unknown;
	try {
		if (isForm) {
			input = Object.fromEntries((await request.formData()).entries());
		} else {
			input = await request.json();
		}
	} catch {
		throw error(400, 'Invalid request body');
	}

	const parsed = schema.safeParse(input);
	if (!parsed.success) {
		throw error(400, 'Expected accessToken (string), optional idToken, expiresIn, deviceId');
	}
	const { accessToken, idToken, expiresIn, deviceId } = parsed.data;

	const cookieOptions = {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: expiresIn
	} as const;

	cookies.set(`${COOKIE_PREFIX}access_token`, accessToken, cookieOptions);
	if (idToken) {
		cookies.set(`${COOKIE_PREFIX}id_token`, idToken, cookieOptions);
	}
	if (expiresIn) {
		cookies.set(`${COOKIE_PREFIX}expires_in`, expiresIn.toString(), cookieOptions);
	}

	if (isForm) {
		redirect(303, deviceId ? `/kiosk?deviceId=${encodeURIComponent(deviceId)}` : '/kiosk');
	}
	return new Response(null, { status: 204 });
};
