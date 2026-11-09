import { describe, expect, test } from 'vitest';
import { findCategory } from '#lib/docs/nav';
import {
	categoryOpen,
	docDescription,
	docEditUrl,
	docNeighbours,
	docPageTitle,
	docTitleFor,
	docToc,
	menuActiveClass,
	navEntryKey,
	pageLabel,
	tocIndentClass,
	type DocsPageData
} from './docsPage';

const chair = 'user-manual/chair';
const toc = [
	{ id: 'a', text: 'A', depth: 2 },
	{ id: 'b', text: 'B', depth: 3 }
];

function markdownPage(overrides: Partial<Extract<DocsPageData, { kind: 'page' }>['doc']> = {}) {
	return {
		slug: 'user-manual/introduction',
		kind: 'page',
		fallback: false,
		doc: { locale: 'de', frontmatter: {}, toc, ...overrides }
	} satisfies DocsPageData;
}

const categoryPage: DocsPageData = { slug: chair, kind: 'category' };

describe('sidebar helpers', () => {
	test('keys entries by their slug', () => {
		expect(navEntryKey('a/b')).toBe('a/b');
		expect(navEntryKey(findCategory(chair)!)).toBe(chair);
	});

	test('marks the current page active', () => {
		expect(menuActiveClass('a', 'a')).toBe('menu-active');
		expect(menuActiveClass('a', 'b')).toBe('');
	});

	test('opens a category for its index and its pages only', () => {
		expect(categoryOpen(chair, chair)).toBe(true);
		expect(categoryOpen(`${chair}/voting`, chair)).toBe(true);
		expect(categoryOpen(`${chair}-other`, chair)).toBe(false);
	});

	test('labels pages by title, else slug', () => {
		expect(pageLabel({ a: 'Title' }, 'a')).toBe('Title');
		expect(pageLabel({}, 'a')).toBe('a');
	});
});

describe('docTitleFor', () => {
	test('uses the page title, the category label, else the slug', () => {
		expect(docTitleFor({ a: 'Title' }, 'a')).toBe('Title');
		expect(docTitleFor({}, chair)).toBe(findCategory(chair)!.label());
		expect(docTitleFor({}, 'unknown')).toBe('unknown');
	});
});

describe('docNeighbours', () => {
	test('finds the previous and next page', () => {
		expect(docNeighbours(['a', 'b', 'c'], 'b')).toEqual({ prev: 'a', next: 'c' });
		expect(docNeighbours(['a', 'b'], 'a')).toEqual({ prev: undefined, next: 'b' });
	});
});

describe('page data helpers', () => {
	test('title from frontmatter, category label or slug', () => {
		expect(docPageTitle(markdownPage({ frontmatter: { title: 'Intro' } }))).toBe('Intro');
		expect(docPageTitle(markdownPage())).toBe('user-manual/introduction');
		expect(docPageTitle(categoryPage)).toBe(findCategory(chair)!.label());
		expect(docPageTitle({ slug: 'nope', kind: 'category' })).toBe('nope');
	});

	test('description only for markdown pages', () => {
		expect(docDescription(markdownPage({ frontmatter: { description: 'D' } }))).toBe('D');
		expect(docDescription(categoryPage)).toBeUndefined();
	});

	test('edit link points at the markdown source in its locale', () => {
		expect(docEditUrl(markdownPage())).toBe(
			'https://github.com/DeutscheModelUnitedNations/munify-chase/edit/main/docs/de/user-manual/introduction.md'
		);
		expect(docEditUrl(categoryPage)).toBeUndefined();
	});

	test('table of contents only with more than one heading', () => {
		expect(docToc(markdownPage())).toBe(toc);
		expect(docToc(markdownPage({ toc: [toc[0]] }))).toEqual([]);
		expect(docToc(categoryPage)).toEqual([]);
	});

	test('indents third-level headings', () => {
		expect(tocIndentClass(toc[0])).toBe('');
		expect(tocIndentClass(toc[1])).toBe('pl-3');
	});
});
