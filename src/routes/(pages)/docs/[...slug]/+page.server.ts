import { error, redirect } from '@sveltejs/kit';
import { loadDoc } from '#lib/docs/content.server';
import { nav } from '#lib/docs/nav';
import { getLocale } from '#lib/paraglide/runtime';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const slug = params.slug.replace(/\/+$/, '');
	if (!slug) redirect(307, `/docs/${nav.defaultSlug}`);

	// Category pages (chair/participant/admin guide) have no markdown, they list their pages
	if (nav.findCategory(slug)) return { slug, kind: 'category' as const };

	const doc = loadDoc(slug, getLocale());
	if (!doc) error(404, 'Not found');
	return { slug, kind: 'page' as const, doc, fallback: doc.locale !== getLocale() };
};
