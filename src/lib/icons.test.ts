import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

// Phosphor icons are font glyphs, which a screen reader can read out as a stray character, also
// inside a button's name. Every icon is aria-hidden; a control showing only an icon carries an
// aria-label, and an icon that means something on its own sits next to sr-only text.

const SRC_DIR = join(process.cwd(), 'src');

function listFiles(dir: string, suffixes: string[]): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) return entry.name === 'paraglide' ? [] : listFiles(path, suffixes);
		return suffixes.some((suffix) => entry.name.endsWith(suffix)) ? [path] : [];
	});
}

/** An `<i …>` opening tag, attribute values (quoted or `{…}`) included */
const ICON_TAG = /<i\b((?:[^>"'{]|"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\})*)>/g;

describe('Phosphor icons', () => {
	it('are hidden from screen readers', () => {
		const unhidden = listFiles(SRC_DIR, ['.svelte', '.ts']).flatMap((file) => {
			const source = readFileSync(file, 'utf8');
			return [...source.matchAll(ICON_TAG)]
				.filter(([, attributes]) => /\bph-/.test(attributes) && !/aria-hidden/.test(attributes))
				.map((match) => {
					const line = source.slice(0, match.index).split('\n').length;
					return `${relative(SRC_DIR, file)}:${line}`;
				});
		});
		expect(unhidden, 'add aria-hidden="true" to these icons').toEqual([]);
	});
});
