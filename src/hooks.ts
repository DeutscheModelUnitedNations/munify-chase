// import { type Handle, redirect } from '@sveltejs/kit';
// import { paraglideMiddleware } from '$lib/paraglide/server';
// import { sequence } from '@sveltejs/kit/hooks';
// import { locales, baseLocale, cookieName, cookieMaxAge } from '$lib/paraglide/runtime';

// const nonBaseLocales = locales.filter((l) => l !== baseLocale);

// /** Redirect locale-prefixed URLs to bare paths, setting the cookie instead. */
// const localeRedirect: Handle = ({ event, resolve }) => {
// 	const { pathname } = event.url;
// 	for (const locale of nonBaseLocales) {
// 		if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
// 			const bare = pathname.slice(`/${locale}`.length) || '/';
// 			const domain = event.url.hostname;
// 			event.cookies.set(cookieName, locale, {
// 				path: '/',
// 				maxAge: cookieMaxAge,
// 				domain,
// 				httpOnly: false,
// 				sameSite: 'lax'
// 			});
// 			redirect(302, bare + event.url.search);
// 		}
// 	}
// 	return resolve(event);
// };

// export const handle: Handle = sequence(localeRedirect, ({ event, resolve }) =>
// 	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
// 		event.request = localizedRequest;

// 		return resolve(event, {
// 			transformPageChunk: ({ html }) => {
// 				return html.replace('%lang%', locale);
// 			}
// 		});
// 	})
// );
