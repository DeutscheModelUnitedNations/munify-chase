import type { LayoutServerLoad } from './(launcher)/$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.oidc?.user
	};
};
