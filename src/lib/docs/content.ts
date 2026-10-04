import { m } from '$lib/paraglide/messages';
import { baseLocale, type Locale } from '$lib/paraglide/runtime';
import { parseFrontmatter, renderDoc, type RenderedDoc } from './render';

// Markdown sources live in `docs/<locale>/` at the repo root, bundled into the client build
const sources = import.meta.glob<string>('/docs/*/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

function sourceFor(locale: string, slug: string) {
	return sources[`/docs/${locale}/${slug}.md`];
}

export function docExists(slug: string) {
	return sourceFor(baseLocale, slug) !== undefined;
}

export type LoadedDoc = RenderedDoc & {
	/** Locale the page was actually rendered in, differs from the request on fallback */
	locale: string;
};

const cache = new Map<string, LoadedDoc>();

/** Renders a page in the requested locale, falling back to the base locale. */
export function loadDoc(slug: string, locale: Locale): LoadedDoc | undefined {
	const key = `${locale}:${slug}`;
	const cached = cache.get(key);
	if (cached) return cached;

	const usedLocale = sourceFor(locale, slug) !== undefined ? locale : baseLocale;
	const source = sourceFor(usedLocale, slug);
	if (source === undefined) return undefined;

	const rendered = renderDoc(source, slug, {
		locale,
		liveLabels: {
			start: m.docsLiveStart({}, { locale }),
			hint: m.docsLiveHint({}, { locale }),
			openInTab: m.docsLiveOpenInTab({}, { locale })
		}
	});
	const doc = { ...rendered, locale: usedLocale };
	cache.set(key, doc);
	return doc;
}

/** Page titles for the sidebar, without rendering the full pages. */
export function docTitles(locale: Locale): Record<string, string> {
	const titles: Record<string, string> = {};
	for (const path of Object.keys(sources)) {
		const match = /^\/docs\/([^/]+)\/(.+)\.md$/.exec(path);
		if (!match) continue;
		const [, fileLocale, slug] = match;
		if (fileLocale !== locale && (fileLocale !== baseLocale || titles[slug])) continue;
		const title = parseFrontmatter(sources[path]).frontmatter.title;
		if (title) titles[slug] = title;
	}
	return titles;
}
