import WorldCountries from 'world-countries';

export interface ParsedCountry {
	alpha2Code: string;
	alpha3Code: string;
	name: string;
}

function findByCode(token: string) {
	const normalized = token.toLowerCase();
	if (token.length === 2) return WorldCountries.find((c) => c.cca2.toLowerCase() === normalized);
	if (token.length === 3) return WorldCountries.find((c) => c.cca3.toLowerCase() === normalized);
	return undefined;
}

/**
 * Reads alpha-2 and alpha-3 country codes from free text (split at newlines, commas,
 * semicolons and whitespace). Each country is listed once; tokens that look like a code
 * (2-3 characters) but match none come back uppercased, once each.
 */
export function parseCountryCodes(text: string) {
	const tokens = text.split(/[\n\r,;\s\t]+/).filter((t) => t.length > 0);

	const countries: ParsedCountry[] = [];
	const unrecognized = new Set<string>();
	const addedCodes = new Set<string>();

	for (const token of tokens) {
		if (addedCodes.has(token.toLowerCase())) continue;
		const country = findByCode(token);
		if (country) {
			const parsed = {
				alpha2Code: country.cca2.toLowerCase(),
				alpha3Code: country.cca3.toLowerCase(),
				name: country.name.common
			};
			countries.push(parsed);
			addedCodes.add(parsed.alpha2Code).add(parsed.alpha3Code);
		} else if (token.length === 2 || token.length === 3) {
			unrecognized.add(token.toUpperCase());
		}
	}

	return { countries, unrecognized: [...unrecognized] };
}
