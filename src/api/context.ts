import type { RequestEvent } from '@sveltejs/kit';

export async function context(req: RequestEvent) {
	// const oidcValue = await oidc(req.cookies);
	// const perms = permissions(oidcValue);
	// return { permissions: perms, oidc: oidcValue, url: req.url };
	return {
		userId: 2
	};
}

export type Context = Awaited<ReturnType<typeof context>>;
