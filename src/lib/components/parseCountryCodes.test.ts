import { describe, expect, it } from 'vitest';
import { parseCountryCodes } from './parseCountryCodes';

describe('parseCountryCodes', () => {
	it('reads alpha-2 and alpha-3 codes, each country once', () => {
		const { countries, unrecognized } = parseCountryCodes('de, DEU;\nfr\tFRA  usa');
		expect(countries.map((c) => c.alpha3Code)).toEqual(['deu', 'fra', 'usa']);
		expect(countries[0]).toEqual({ alpha2Code: 'de', alpha3Code: 'deu', name: 'Germany' });
		expect(unrecognized).toEqual([]);
	});

	it('reports unknown code-like tokens once, ignoring other words', () => {
		const { countries, unrecognized } = parseCountryCodes('xx XX qqq germany a');
		expect(countries).toEqual([]);
		expect(unrecognized).toEqual(['XX', 'QQQ']);
	});

	it('reads nothing from empty text', () => {
		expect(parseCountryCodes('  \n ')).toEqual({ countries: [], unrecognized: [] });
	});
});
