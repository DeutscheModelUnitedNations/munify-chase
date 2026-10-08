// world-countries

import { getLocale, locales } from '$lib/paraglide/runtime';
import { SvelteMap } from 'svelte/reactivity';
import allNations from 'world-countries';

//TODO this could probably be part of the localization engine
function nationCodeToLocalName(code: string, locale = getLocale(), official = false) {
	const getTranslationCode = (locale: string) => {
		switch (locale) {
			case 'de':
				return 'deu';
			case 'en':
				return 'eng';
			case 'pt':
				return 'por';
			default:
				return 'eng';
		}
	};

	const nation = allNations.find((nation) => {
		if (code.length === 2) return nation.cca2 === code.toUpperCase();
		return nation.cca3 === code.toUpperCase();
	});

	if (!nation) {
		return 'N/A';
	}

	let translation;

	if (getTranslationCode(locale) == 'eng') {
		translation = nation.name;
	} else {
		if (!nation.translations || !nation.translations[getTranslationCode(locale)]) {
			return 'N/A';
		}
		translation = nation.translations[getTranslationCode(locale)];
	}

	if (official) {
		return translation.official;
	}
	return translation.common;
}

// we build an index of nation codes to translation objects
type TranslationObject = { [key in (typeof locales)[number]]: string };
const NationIso3ToLocalNamesMap = new SvelteMap<string, TranslationObject>();

for (const nation of allNations) {
	const translationObject: TranslationObject = {} as TranslationObject;
	for (const locale of locales) {
		translationObject[locale] = nationCodeToLocalName(nation.cca3, locale);
	}
	NationIso3ToLocalNamesMap.set(nation.cca3, translationObject);
}

Object.freeze(NationIso3ToLocalNamesMap);

/** Accepts either an ISO 3166-1 alpha-2 or alpha-3 code, returns the localised country name or null. */
export const getCountryNameFromCode = (code: string | null | undefined): string | null => {
	if (!code) return null;
	const result = nationCodeToLocalName(code);
	return result === 'N/A' ? null : result;
};

export const getTranslatedCountryNameFromAlpha3Code = (alpha3Code?: string | null) => {
	if (!alpha3Code) return 'N/A';
	const found = NationIso3ToLocalNamesMap.get(alpha3Code.toUpperCase());
	if (found) return found[getLocale()];

	console.warn('Could not translate country code', alpha3Code);
	return 'N/A';
};

export const sortTranslatedCountries = (
	a: { alpha3Code?: string | null; name?: string | null; [key: string]: unknown },
	b: { alpha3Code?: string | null; name?: string | null; [key: string]: unknown }
) => {
	if ((!a.alpha3Code && !a.name) || (!b.alpha3Code && !b.name)) return 0;
	return (a.name ?? getTranslatedCountryNameFromAlpha3Code(a.alpha3Code)).localeCompare(
		b.name ?? getTranslatedCountryNameFromAlpha3Code(b.alpha3Code)
	);
};
