import { describe, expect, it } from 'vitest';
import { docTitles, loadDoc, titlesFrom } from './content.server';

const page = (title?: string) => (title ? `---\ntitle: ${title}\n---\nBody` : 'Body');

describe('titlesFrom', () => {
	const markdown = {
		'/docs/en/faq.md': page('FAQ'),
		'/docs/de/faq.md': page('Häufige Fragen'),
		'/docs/en/user-manual/voting.md': page('Voting'),
		'/docs/de/untitled.md': page(),
		'/docs/notes.md': page('Not a page')
	};

	it('takes the locale’s titles, falling back to the base locale', () => {
		expect(titlesFrom(markdown, 'de')).toEqual({
			faq: 'Häufige Fragen',
			'user-manual/voting': 'Voting'
		});
	});

	it('skips pages without a title and paths outside a locale', () => {
		expect(titlesFrom(markdown, 'en')).toEqual({ faq: 'FAQ', 'user-manual/voting': 'Voting' });
	});
});

describe('the bundled manual', () => {
	it('titles every page', () => {
		expect(docTitles('de').faq).toBeTruthy();
	});

	it('renders a page once and caches it', () => {
		const doc = loadDoc('faq', 'pt');
		expect(doc?.locale).toBe('pt');
		expect(loadDoc('faq', 'pt')).toBe(doc);
		expect(loadDoc('does-not-exist', 'en')).toBeUndefined();
	});
});
