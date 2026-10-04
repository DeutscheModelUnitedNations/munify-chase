import { docTitles } from '$lib/docs/content';
import { getLocale } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => ({
	titles: docTitles(getLocale())
});
