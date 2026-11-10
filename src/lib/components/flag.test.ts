import { describe, expect, it } from 'vitest';
import { flagCardClass, flagCountryCode, representationOrUn } from './flag';

describe('flagCountryCode', () => {
	it('prefers the UN, then alpha-2, then a converted alpha-3', () => {
		expect(flagCountryCode({ type: 'UN', alpha2Code: 'DE' })).toBe('un');
		expect(flagCountryCode({ alpha2Code: 'DE' })).toBe('de');
		expect(flagCountryCode({ alpha3Code: 'FRA' })).toBe('fr');
		expect(flagCountryCode(null)).toBeNull();
	});
});

describe('flagCardClass', () => {
	it('colours placeholders, NSAs and delegations', () => {
		expect(flagCardClass({ type: null, placeholder: true })).toContain('opacity-50');
		expect(flagCardClass({ type: 'NSA', placeholder: false })).toContain('bg-error');
		expect(flagCardClass({ type: 'DELEGATION', placeholder: false })).toContain('bg-[#bea162]');
		expect(flagCardClass({ type: 'UN', placeholder: false })).toBe('');
		expect(flagCardClass({ type: 'toString', placeholder: false })).toBe('');
	});
});

describe('representationOrUn', () => {
	it('keeps a representation with a code or an icon', () => {
		const rep = { alpha3Code: 'DEU' };
		expect(representationOrUn(rep)).toBe(rep);
		expect(representationOrUn({ icon: 'x' })).toEqual({ icon: 'x' });
		expect(representationOrUn({ alpha2Code: 'de' })).toEqual({ alpha2Code: 'de' });
	});

	it('falls back to the UN', () => {
		expect(representationOrUn(null)).toEqual({ type: 'UN' });
		expect(representationOrUn({ type: 'NSA' })).toEqual({ type: 'UN' });
	});
});
