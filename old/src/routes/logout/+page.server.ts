import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { OIDC } from '$api/services/OIDC';

export const load: PageServerLoad = async ({ url }) => {
	redirect(308, await OIDC.getLogoutUrl(url));
};
