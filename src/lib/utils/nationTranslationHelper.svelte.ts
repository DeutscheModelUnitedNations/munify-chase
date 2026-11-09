// world-countries

import { getLocale, locales } from '#lib/paraglide/runtime';
import allNations from 'world-countries';

type Nation = (typeof allNations)[number];

/** world-countries keys its translations by ISO 639-3 code; English is the nation's own name */
const TRANSLATION_CODES: Record<string, string> = { de: 'deu', en: 'eng', pt: 'por' };

function findNation(code: string): Nation | undefined {
	const upper = code.toUpperCase();
	return allNations.find((nation) => (code.length === 2 ? nation.cca2 : nation.cca3) === upper);
}

function nationNames(nation: Nation, locale: string) {
	const translationCode = TRANSLATION_CODES[locale] ?? 'eng';
	if (translationCode === 'eng') return nation.name;
	return nation.translations?.[translationCode];
}

//TODO this could probably be part of the localization engine
function nationCodeToLocalName(code: string, locale = getLocale()) {
	const nation = findNation(code);
	const names = nation && nationNames(nation, locale);
	return names ? names.common : 'N/A';
}

// we build an index of nation codes to translation objects
type TranslationObject = { [key in (typeof locales)[number]]: string };
const nationIso3ToLocalNames = new Map<string, TranslationObject>();

for (const nation of allNations) {
	const translationObject = Object.fromEntries(
		locales.map((locale) => [locale, nationCodeToLocalName(nation.cca3, locale)])
	);
	nationIso3ToLocalNames.set(nation.cca3, translationObject as TranslationObject);
}

/** Accepts either an ISO 3166-1 alpha-2 or alpha-3 code, returns the localised country name or null. */
export const getCountryNameFromCode = (code: string | null | undefined): string | null => {
	if (!code) return null;
	const result = nationCodeToLocalName(code);
	return result === 'N/A' ? null : result;
};

export const getTranslatedCountryNameFromAlpha3Code = (alpha3Code?: string | null) => {
	if (!alpha3Code) return 'N/A';
	const found = nationIso3ToLocalNames.get(alpha3Code.toUpperCase());
	if (found) return found[getLocale()];

	console.warn('Could not translate country code', alpha3Code);
	return 'N/A';
};

type SortableCountry = { alpha3Code?: string | null; name?: string | null; [key: string]: unknown };

const displayName = (country: SortableCountry) =>
	country.name ?? getTranslatedCountryNameFromAlpha3Code(country.alpha3Code);

const isNamed = (country: SortableCountry) => Boolean(country.alpha3Code || country.name);

export const sortTranslatedCountries = (a: SortableCountry, b: SortableCountry) => {
	if (!isNamed(a) || !isNamed(b)) return 0;
	return displayName(a).localeCompare(displayName(b));
};
