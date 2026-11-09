import { redirect } from '@sveltejs/kit';

// import sockets here to ensure they are bundles with the rest of the application
import '#api/websocket';

import { paraglideMiddleware } from '#lib/paraglide/server';
import { sequence, type Handle, type ServerInit } from '@sveltejs/kit/hooks';
import { OIDC } from '#api/services/OIDC';
import { locales, baseLocale, cookieName, cookieMaxAge } from '#lib/paraglide/runtime';
import { isLocalConferencePath } from '#lib/state/localDemo.svelte';
import { building } from '$app/env';
import { resumeLinkWorker } from '#api/services/link/linkWorker';
import { LINK_TOKEN_HEADER } from '#api/services/link/linkAuth';
import { isLinkCall } from '#api/services/link/linkCaller';
import { localePrefix } from '#api/services/localePrefix';

/** Picks the DELEGATOR link up again (`docs/plans/delegator-link.md`). */
export const init: ServerInit = async () => {
	if (building) return;
	await resumeLinkWorker().catch((error) =>
		console.error('[link] could not resume the link worker', error)
	);
};

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

// The offline demo conference never has a real OIDC session (it's reachable without
// logging in at all)
const oidcOrLocalDemoBypass: Handle = ({ event, resolve }) => {
	if (isLocalConferencePath(event.url.pathname)) {
		return resolve(event);
	}
	return OIDC.handle({ event, resolve });
};

const nonBaseLocales = locales.filter((l) => l !== baseLocale);

/** Redirect locale-prefixed URLs to bare paths, setting the cookie instead. */
const localeRedirect: Handle = ({ event, resolve }) => {
	const prefixed = localePrefix({ pathname: event.url.pathname, locales: nonBaseLocales });
	if (prefixed) {
		event.cookies.set(cookieName, prefixed.locale, {
			path: '/',
			maxAge: cookieMaxAge,
			domain: event.url.hostname,
			httpOnly: false,
			sameSite: 'lax'
		});
		redirect(302, prefixed.bare + event.url.search);
	}
	return resolve(event);
};

// The linked DELEGATOR calls with a token of its own instead of a session; whether it grants the
// `delegator` role is checked once here, and the context hands it on as that role.
const linkHandle: Handle = async ({ event, resolve }) => {
	const token = event.request.headers.get(LINK_TOKEN_HEADER);
	if (token) event.locals.linkCaller = await isLinkCall(token);
	return resolve(event);
};

export const handle: Handle = sequence(
	tauriCors,
	linkHandle,
	oidcOrLocalDemoBypass,
	localeRedirect,
	({ event, resolve }) =>
		// Without a url locale strategy the middleware's request equals event.request, so
		// the event is passed on unchanged (its request is read-only since SvelteKit 3)
		paraglideMiddleware(event.request, ({ locale }) => {
			return resolve(event, {
				transformPageChunk: ({ html }) => {
					return html.replace('%lang%', locale);
				}
			});
		})
);
