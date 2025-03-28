import type { RequestEvent } from '@sveltejs/kit';

export async function context(req: RequestEvent) {
	return req.locals;
}

export type Context = Awaited<ReturnType<typeof context>>;
