import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	const exp = (locals.oidc?.accessToken as { exp?: number } | undefined)?.exp ?? null;
	return { tokenExp: exp };
};
