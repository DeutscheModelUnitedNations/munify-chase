import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Fails when a component loses a `data-tour` anchor that a tour still points at,
// so tours can't silently break when the UI changes.

const SRC_DIR = join(process.cwd(), 'src');

function listFiles(dir: string, suffix: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return entry.name === 'paraglide' ? [] : listFiles(path, suffix);
		return entry.name.endsWith(suffix) ? [path] : [];
	});
}

/** Anchors defined in markup, including conditional ones like `data-tour={x ? 'a' : 'b'}` */
function definedAnchors() {
	const anchors = new Set<string>();
	for (const file of listFiles(SRC_DIR, '.svelte')) {
		const source = readFileSync(file, 'utf8');
		for (const [, plain, expression] of source.matchAll(/data-tour=(?:"([^"]+)"|\{([^}]+)\})/g)) {
			if (plain) anchors.add(plain);
			for (const [, quoted] of expression?.matchAll(/['"`]([\w.-]+)['"`]/g) ?? []) {
				anchors.add(quoted);
			}
		}
		// Helpers that build anchors from a prefix, e.g. `speakers-list.${name}` + tourAnchor('timer')
		for (const [, prefix] of source.matchAll(/`([\w-]+\.)\$\{name\}`/g)) {
			for (const [, name] of source.matchAll(/tourAnchor\('([\w-]+)'\)/g)) {
				anchors.add(prefix + name);
			}
		}
	}
	return anchors;
}

function usedAnchors() {
	return listFiles(SRC_DIR, '.tour.ts').flatMap((file) =>
		[...readFileSync(file, 'utf8').matchAll(/anchor:\s*'([^']+)'/g)].map(([, anchor]) => ({
			file,
			anchor
		}))
	);
}

describe('tour anchors', () => {
	const defined = definedAnchors();
	const used = usedAnchors();

	it('finds tours to check', () => {
		expect(used.length).toBeGreaterThan(0);
	});

	it.each(used.map((u) => [u.anchor, u.file]))('"%s" exists in the markup', (anchor) => {
		expect(defined).toContain(anchor);
	});
});
