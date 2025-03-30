import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { applyAuth } from '$api/services/OIDC';

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
	event.locals.user = await applyAuth({ event, authenticatedRoutes });
	return paraglideHandle({ event, resolve });
};
