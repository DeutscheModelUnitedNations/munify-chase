import { docTitles } from '$lib/docs/content.server';
import { getLocale } from '$lib/paraglide/runtime';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => ({
	titles: docTitles(getLocale())
});
