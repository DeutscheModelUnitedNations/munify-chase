import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { docsSuite, listFiles } from '@deutschemodelunitednations/docs-kit/testing';
import { routeHelp } from '#lib/tours/routeHelp';
import { liveDemoIds } from './live';
import { nav } from './nav';
import { renderChaseDoc } from './render';

// Keeps the in-repo manual consistent: every page exists in every locale, and
// links, anchors, screenshots, live demos and help buttons point at things that exist.

const LOCALES = ['en', 'de', 'pt'];
const LIVE_LABELS = { start: '', hint: '', openInTab: '' };

docsSuite({
	locales: LOCALES,
	nav,
	render: ({ source, slug, locale }) =>
		renderChaseDoc({ source, slug, locale, liveLabels: LIVE_LABELS }),
	shotsManifest: 'scripts/docs-screenshots/shots.ts',
	helpTargets: Object.fromEntries(
		Object.entries(routeHelp).map(([route, help]) => [route, help?.docs])
	)
});

describe('live demos', () => {
	const docsDir = join(process.cwd(), 'docs');
	const sources = LOCALES.flatMap((locale) =>
		listFiles({ dir: join(docsDir, locale), suffix: '.md' }).map((file) =>
			readFileSync(file, 'utf8')
		)
	);

	it('only embeds known live demos', () => {
		for (const source of sources) {
			for (const [, id] of source.matchAll(/^:::live[ \t]+(\S+)/gm)) {
				expect(liveDemoIds, `:::live ${id}`).toContain(id);
			}
		}
	});

	it('renders a live demo as its start button, not as text', () => {
		const { html } = renderChaseDoc({
			source: `:::live ${liveDemoIds[0]}\n`,
			slug: 'user-manual/chair/voting',
			locale: 'en',
			liveLabels: LIVE_LABELS
		});
		expect(html).toContain('data-docs-live-start');
		expect(html).not.toContain(':::live');
	});
});
