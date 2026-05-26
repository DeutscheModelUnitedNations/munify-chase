import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ locals }) => {
	const exp = (locals.oidc?.accessToken as { exp?: number } | undefined)?.exp ?? null;
	return new Response(JSON.stringify({ exp }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
