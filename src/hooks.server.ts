// import sockets here to ensure they are bundles with the rest of the application
import '$api/websocket';
import { type Handle, redirect } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { OIDC } from '$api/services/OIDC';
import { locales, baseLocale, cookieName, cookieMaxAge } from '$lib/paraglide/runtime';

const TAURI_ORIGIN = 'tauri://localhost';

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
	tauriCors,
	OIDC.handle,
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
