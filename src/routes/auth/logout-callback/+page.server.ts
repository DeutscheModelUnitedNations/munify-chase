import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { codeVerifierCookieName, oidcStateCookieName, tokensCookieName } from '$api/services/OIDC';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete(tokensCookieName, { path: '/' });
	cookies.delete(codeVerifierCookieName, { path: '/' });
	cookies.delete(oidcStateCookieName, { path: '/' });

	redirect(303, '/');
};
