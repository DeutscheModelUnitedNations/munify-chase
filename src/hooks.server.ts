import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { handleProtectedRoute } from '$api/services/OIDC';

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

const authenticatedRoutes = ['/app'];

export const handle: Handle = async ({ event, resolve }) => {
	if (authenticatedRoutes.map((r) => event.url.pathname.startsWith(r)).some(Boolean)) {
		event.locals.user = await handleProtectedRoute(event);
		return paraglideHandle({ event, resolve });
	}
	return paraglideHandle({ event, resolve });
};
