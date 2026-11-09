import { beforeEach, describe, expect, it, vi } from 'vitest';

const locale = vi.hoisted(() => ({ current: 'en' }));
vi.mock('#lib/paraglide/runtime', () => ({
	locales: ['de', 'en', 'pt'],
	getLocale: () => locale.current
}));

const { getCountryNameFromCode, getTranslatedCountryNameFromAlpha3Code, sortTranslatedCountries } =
	await import('./nationTranslationHelper.svelte');

beforeEach(() => {
	locale.current = 'en';
});

describe('getCountryNameFromCode', () => {
	it('accepts alpha-2 and alpha-3 codes in any case', () => {
		expect(getCountryNameFromCode('de')).toBe('Germany');
		expect(getCountryNameFromCode('FRA')).toBe('France');
	});

	it('translates into the current locale', () => {
		locale.current = 'de';
		expect(getCountryNameFromCode('FRA')).toBe('Frankreich');
		locale.current = 'pt';
		expect(getCountryNameFromCode('DEU')).toBe('Alemanha');
	});

	it('is null for an unknown or missing code', () => {
		expect(getCountryNameFromCode('XXX')).toBeNull();
		expect(getCountryNameFromCode(null)).toBeNull();
		expect(getCountryNameFromCode('')).toBeNull();
	});
});

describe('getTranslatedCountryNameFromAlpha3Code', () => {
	it('reads the index in the current locale', () => {
		expect(getTranslatedCountryNameFromAlpha3Code('deu')).toBe('Germany');
		locale.current = 'de';
		expect(getTranslatedCountryNameFromAlpha3Code('DEU')).toBe('Deutschland');
	});

	it('answers N/A without a code or for an unknown one', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		expect(getTranslatedCountryNameFromAlpha3Code(undefined)).toBe('N/A');
		expect(getTranslatedCountryNameFromAlpha3Code('XXX')).toBe('N/A');
		expect(warn).toHaveBeenCalledOnce();
		warn.mockRestore();
	});
});

describe('sortTranslatedCountries', () => {
	it('sorts by the given name, else by the translated code', () => {
		const countries = [{ alpha3Code: 'FRA' }, { name: 'Atlantis' }, { alpha3Code: 'DEU' }];
		expect(countries.sort(sortTranslatedCountries)).toEqual([
			{ name: 'Atlantis' },
			{ alpha3Code: 'FRA' },
			{ alpha3Code: 'DEU' }
		]);
	});

	it('keeps the order of entries without a name or code', () => {
		expect(sortTranslatedCountries({}, { name: 'A' })).toBe(0);
		expect(sortTranslatedCountries({ name: 'A' }, { alpha3Code: null })).toBe(0);
	});
});
