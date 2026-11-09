import { describe, expect, it } from 'vitest';
import { contrastIsMore, storedContrastChoice } from './contrast';

describe('storedContrastChoice', () => {
	it('accepts the two choices only', () => {
		expect(storedContrastChoice('more')).toBe('more');
		expect(storedContrastChoice('normal')).toBe('normal');
		expect(storedContrastChoice(null)).toBeNull();
		expect(storedContrastChoice('high')).toBeNull();
	});
});

describe('contrastIsMore', () => {
	it('follows the system until someone chooses', () => {
		expect(contrastIsMore({ choice: null, systemPrefersMore: true })).toBe(true);
		expect(contrastIsMore({ choice: null, systemPrefersMore: false })).toBe(false);
	});

	it('keeps a choice whatever the system says', () => {
		expect(contrastIsMore({ choice: 'normal', systemPrefersMore: true })).toBe(false);
		expect(contrastIsMore({ choice: 'more', systemPrefersMore: false })).toBe(true);
	});
});
