import type { RequestEvent } from '@sveltejs/kit';

export async function context(req: RequestEvent) {
	return {
		...req.locals,
		mustBeLoggedIn: () => {
			if (!req.locals.oidc?.user) {
				throw new Error('Must be logged in');
			}

			return req.locals.oidc.user;
		}
	};
}

export type Context = Awaited<ReturnType<typeof context>>;
