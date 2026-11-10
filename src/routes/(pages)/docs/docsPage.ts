import { findCategory, type DocsNavEntry } from '#lib/docs/nav';
import type { DocsFrontmatter, DocsTocEntry } from '#lib/docs/render';

export type DocsTitles = Record<string, string>;

/** What the `[...slug]` page loads: a markdown page or a category's index. */
export type DocsPageData =
	| { slug: string; kind: 'category' }
	| {
			slug: string;
			kind: 'page';
			doc: { locale: string; frontmatter: DocsFrontmatter; toc: DocsTocEntry[] };
			fallback: boolean;
	  };

/** Key for the sidebar's `#each`: the page slug or the category slug. */
export function navEntryKey(entry: DocsNavEntry) {
	return typeof entry === 'string' ? entry : entry.slug;
}

export function menuActiveClass(current: string, slug: string) {
	return current === slug ? 'menu-active' : '';
}

/** A sidebar category starts open while one of its pages, or its index, is shown. */
export function categoryOpen(current: string, slug: string) {
	return current === slug || current.startsWith(`${slug}/`);
}

/** Sidebar label of a page: its frontmatter title, else its slug. */
export function pageLabel(titles: DocsTitles, slug: string) {
	return titles[slug] ?? slug;
}

/** Link label of a page or category: the page's title, the category's label, else the slug. */
export function docTitleFor(titles: DocsTitles, slug: string) {
	return titles[slug] ?? findCategory(slug)?.label() ?? slug;
}

/** The pages before and after `slug` in reading order. */
export function docNeighbours(slugs: readonly string[], slug: string) {
	const index = slugs.indexOf(slug);
	return { prev: slugs[index - 1], next: slugs[index + 1] };
}

/** The `<title>` of a docs page: the frontmatter title or the category label, else the slug. */
export function docPageTitle(data: DocsPageData) {
	if (data.kind === 'page') return data.doc.frontmatter.title ?? data.slug;
	return findCategory(data.slug)?.label() ?? data.slug;
}

export function docDescription(data: DocsPageData) {
	return data.kind === 'page' ? data.doc.frontmatter.description : undefined;
}

/** "Edit this page" link to the markdown source on GitHub, only for markdown pages. */
export function docEditUrl(data: DocsPageData) {
	if (data.kind !== 'page') return undefined;
	return `https://github.com/DeutscheModelUnitedNations/munify-chase/edit/main/docs/${data.doc.locale}/${data.slug}.md`;
}

/** The "On this page" entries, none for a category or a page with a single heading. */
export function docToc(data: DocsPageData): DocsTocEntry[] {
	if (data.kind !== 'page' || data.doc.toc.length <= 1) return [];
	return data.doc.toc;
}

export function tocIndentClass(entry: DocsTocEntry) {
	return entry.depth === 3 ? 'pl-3' : '';
}
