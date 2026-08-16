// import sockets here to ensure they are bundles with the rest of the application
import '$api/websocket';
import { type Handle, redirect } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { OIDC } from '$api/services/OIDC';
import { kioskOIDCHandle } from '$api/services/kioskOIDC';
import { locales, baseLocale, cookieName, cookieMaxAge } from '$lib/paraglide/runtime';

const TAURI_ORIGIN = 'tauri://localhost';
const KIOSK_BOOTSTRAP_ORIGIN = 'http://127.0.0.1:8081';

/**
 * `kit.csrf.trustedOrigins` (svelte.config.js) exempts KIOSK_BOOTSTRAP_ORIGIN
 * from SvelteKit's CSRF check so the Pi kiosk's cross-origin form POST to
 * /api/kiosk/session can go through. That exemption is unavoidably global —
 * `trustedOrigins` is a flat origin allowlist with no path/method scoping,
 * and SvelteKit's own check runs inside `respond()` before any `handle` hook
 * is invoked, so a hook can't intercept or narrow it from the inside. What a
 * hook *can* do is run after the fact and reject anything that used the
 * exemption for something other than the one request it exists for — closing
 * the gap where any other local dev server someone happens to run on
 * 127.0.0.1:8081 could otherwise forge cross-origin form POSTs to any other
 * mutating route on this deployment while claiming the same origin.
 */
const kioskOriginScope: Handle = ({ event, resolve }) => {
	const origin = event.request.headers.get('origin');
	if (origin !== KIOSK_BOOTSTRAP_ORIGIN) return resolve(event);

	const isKioskSessionPost =
		event.request.method === 'POST' && event.url.pathname === '/api/kiosk/session';
	if (!isKioskSessionPost) {
		return new Response('Cross-site request forbidden', { status: 403 });
	}

	return resolve(event);
};

/** Allow the Tauri desktop shell (origin tauri://localhost) to reach the API. */
const tauriCors: Handle = async ({ event, resolve }) => {
	const origin = event.request.headers.get('origin');
	if (origin !== TAURI_ORIGIN) return resolve(event);

	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: {
				'Access-Control-Allow-Origin': TAURI_ORIGIN,
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Max-Age': '86400'
			}
		});
	}

	const response = await resolve(event);
	response.headers.set('Access-Control-Allow-Origin', TAURI_ORIGIN);
	response.headers.set('Access-Control-Allow-Credentials', 'true');
	return response;
};

const nonBaseLocales = locales.filter((l) => l !== baseLocale);

/** Redirect locale-prefixed URLs to bare paths, setting the cookie instead. */
const localeRedirect: Handle = ({ event, resolve }) => {
	const { pathname } = event.url;
	for (const locale of nonBaseLocales) {
		if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
			const bare = pathname.slice(`/${locale}`.length) || '/';
			const domain = event.url.hostname;
			event.cookies.set(cookieName, locale, {
				path: '/',
				maxAge: cookieMaxAge,
				domain,
				httpOnly: false,
				sameSite: 'lax'
			});
			redirect(302, bare + event.url.search);
		}
	}
	return resolve(event);
};

export const handle: Handle = sequence(
	kioskOriginScope,
	tauriCors,
	OIDC.handle,
	// Runs unconditionally after OIDC.handle, not only as a fallback — see
	// the doc comment on kioskOIDCHandle in kioskOIDC.ts for why it can't be
	// gated on whether OIDC.handle already set a session.
	kioskOIDCHandle,
	localeRedirect,
	({ event, resolve }) =>
		paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
			event.request = localizedRequest;

			return resolve(event, {
				transformPageChunk: ({ html }) => {
					return html.replace('%lang%', locale);
				}
			});
		})
);
