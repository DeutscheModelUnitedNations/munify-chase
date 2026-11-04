import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { docsSuite, listFiles } from '@deutschemodelunitednations/docs-kit/testing';
import { routeHelp } from '#lib/tours/routeHelp';
import { liveDemoIds } from './live';
import { nav } from './nav';
import { renderChaseDoc } from './render';

// Keeps the in-repo manual consistent: every page exists in every locale, and
// links, anchors, screenshots, live demos and help buttons point at things that exist.

const LIVE_LABELS = { start: '', hint: '', openInTab: '' };

docsSuite({
	locales: ['en', 'de', 'pt'],
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
	const sources = readdirSync(docsDir).flatMap((locale) =>
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
});
