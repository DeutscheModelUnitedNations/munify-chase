import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$api/db/db';
import { dev } from '$app/environment';
import { DISPLAY_TOKEN_COOKIE } from '$api/displayTokenCookie';

export const load: PageServerLoad = async ({ params, cookies, locals }) => {
	const token = await db.query.displayToken.findFirst({
		where: { code: params.code }
	});

	if (!token || token.revokedAt) {
		error(404, 'Display link not found');
	}

	cookies.set(DISPLAY_TOKEN_COOKIE, params.code, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 365
	});

	// Also expose it for this request's own SSR GraphQL call so the first
	// paint is populated (subsequent requests / the websocket read the cookie).
	locals.displayToken = params.code;

	return {
		conferenceId: token.conferenceId,
		showStateOfDebate: token.showStateOfDebate
	};
};
