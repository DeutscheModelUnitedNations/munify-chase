// import type { RequestEvent } from '@sveltejs/kit';

// _req: RequestEvent
export async function context() {
	// const oidcValue = await oidc(req.cookies);
	// const perms = permissions(oidcValue);
	// return { permissions: perms, oidc: oidcValue, url: req.url };
	return {
		userId: 2
	};
}

export type Context = Awaited<ReturnType<typeof context>>;
