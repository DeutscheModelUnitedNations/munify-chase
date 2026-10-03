import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { liveDemoIds } from './live';
import { docsNav, findCategory, flatDocsSlugs } from './nav';
import { renderDoc } from './render';
import { routeHelp } from '$lib/tours/routeHelp';

// Keeps the in-repo manual consistent: every page exists in every locale, and
// links, anchors, screenshots and live demos point at things that exist.

const DOCS_DIR = join(process.cwd(), 'docs');
const STATIC_DIR = join(process.cwd(), 'static');
const LOCALES = ['en', 'de', 'pt'];
const LIVE_LABELS = { start: '', hint: '', openInTab: '' };

// Read as text, the manifest itself pulls in Playwright and the database
const shotIds = [
	...readFileSync(join(process.cwd(), 'scripts/docs-screenshots/shots.ts'), 'utf8').matchAll(
		/^\t\t?\{?\s*id: '([^']+)'/gm
	)
].map(([, id]) => id);

function listMarkdown(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return listMarkdown(path);
		return entry.name.endsWith('.md') ? [path] : [];
	});
}

function slugsFor(locale: string) {
	return listMarkdown(join(DOCS_DIR, locale))
		.map((path) => relative(join(DOCS_DIR, locale), path).replace(/\.md$/, ''))
		.sort();
}

const pageSlugs = docsNav.flatMap((e) => (typeof e === 'string' ? [e] : e.items));

function isKnownSlug(slug: string) {
	return pageSlugs.includes(slug) || findCategory(slug) !== undefined;
}

describe('docs', () => {
	it('lists every markdown page in the sidebar and nothing else', () => {
		expect(slugsFor('en')).toEqual([...pageSlugs].sort());
	});

	it.each(LOCALES)('has every page translated to %s', (locale) => {
		expect(slugsFor(locale)).toEqual(slugsFor('en'));
	});

	it('has no duplicate sidebar entries', () => {
		const slugs = flatDocsSlugs();
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	describe.each(LOCALES)('%s', (locale) => {
		const rendered = new Map(
			slugsFor(locale).map((slug) => [
				slug,
				renderDoc(readFileSync(join(DOCS_DIR, locale, `${slug}.md`), 'utf8'), slug, {
					locale,
					liveLabels: LIVE_LABELS
				})
			])
		);

		it.each([...rendered.keys()])('%s has a title and valid links and images', (slug) => {
			const doc = rendered.get(slug)!;
			expect(doc.frontmatter.title, 'frontmatter title').toBeTruthy();

			for (const [, href] of doc.html.matchAll(/<a href="(\/[^"]*)"/g)) {
				const [path, hash] = href.split('#');
				if (!path.startsWith('/docs/')) continue;
				const target = path.slice('/docs/'.length);
				expect(isKnownSlug(target), `link to ${href}`).toBe(true);
				if (hash) {
					const ids = rendered.get(target)?.toc.map((t) => t.id) ?? [];
					expect(ids, `anchor ${href}`).toContain(hash);
				}
			}

			for (const [, src] of doc.html.matchAll(/<img src="([^"]+)"/g)) {
				expect(
					existsSync(join(STATIC_DIR, src)),
					`image ${src}, run bun run docs:screenshots`
				).toBe(true);
			}
		});
	});

	const sources = LOCALES.flatMap((locale) =>
		slugsFor(locale).map((slug) => readFileSync(join(DOCS_DIR, locale, `${slug}.md`), 'utf8'))
	);

	it('only uses screenshots listed in scripts/docs-screenshots/shots.ts', () => {
		const used = new Set(
			sources.flatMap((s) => [...s.matchAll(/\]\(shot:([^)]+)\)/g)].map((m) => m[1]))
		);
		for (const id of used) expect(shotIds, `shot:${id}`).toContain(id);
		for (const id of shotIds) expect(used, `${id} is captured but never used`).toContain(id);
	});

	it('only embeds known live demos', () => {
		for (const source of sources) {
			for (const [, id] of source.matchAll(/^:::live[ \t]+(\S+)/gm)) {
				expect(liveDemoIds, `:::live ${id}`).toContain(id);
			}
		}
	});

	it('points every help button at an existing page', () => {
		for (const [route, help] of Object.entries(routeHelp)) {
			expect(isKnownSlug(help!.docs), `${route} -> ${help!.docs}`).toBe(true);
		}
	});
});
