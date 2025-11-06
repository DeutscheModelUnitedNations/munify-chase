// world-countries

import allNations from "world-countries";
import { getLocale, locales } from "$lib/paraglide/runtime";

const addressNations = [
  { iso_code: "ZAF" },
  { iso_code: "AUT" },
  { iso_code: "IND" },
  { iso_code: "AFG" },
  { iso_code: "ALB" },
  { iso_code: "DEU" },
  { iso_code: "AND" },
  { iso_code: "AGO" },
  { iso_code: "AIA" },
  { iso_code: "ATA" },
  { iso_code: "ATG" },
  { iso_code: "SAU" },
  { iso_code: "DZA" },
  { iso_code: "ARG" },
  { iso_code: "ARM" },
  { iso_code: "ABW" },
  { iso_code: "AUS" },
  { iso_code: "AZE" },
  { iso_code: "BEL" },
  { iso_code: "BIH" },
  { iso_code: "BHS" },
  { iso_code: "BGD" },
  { iso_code: "BHR" },
  { iso_code: "BRB" },
  { iso_code: "BLZ" },
  { iso_code: "BEN" },
  { iso_code: "BMU" },
  { iso_code: "BLR" },
  { iso_code: "MMR" },
  { iso_code: "BOL" },
  { iso_code: "BWA" },
  { iso_code: "BRA" },
  { iso_code: "BRN" },
  { iso_code: "BGR" },
  { iso_code: "BDI" },
  { iso_code: "BFA" },
  { iso_code: "BTN" },
  { iso_code: "CPV" },
  { iso_code: "CMR" },
  { iso_code: "KHM" },
  { iso_code: "CAN" },
  { iso_code: "QAT" },
  { iso_code: "KAZ" },
  { iso_code: "TCD" },
  { iso_code: "CHL" },
  { iso_code: "CHN" },
  { iso_code: "CYP" },
  { iso_code: "COL" },
  { iso_code: "COM" },
  { iso_code: "COG" },
  { iso_code: "COD" },
  { iso_code: "PRK" },
  { iso_code: "KOR" },
  { iso_code: "CRI" },
  { iso_code: "CIV" },
  { iso_code: "HRV" },
  { iso_code: "CUB" },
  { iso_code: "DNK" },
  { iso_code: "DMA" },
  { iso_code: "EGY" },
  { iso_code: "ARE" },
  { iso_code: "ECU" },
  { iso_code: "ERI" },
  { iso_code: "SVK" },
  { iso_code: "SVN" },
  { iso_code: "ESP" },
  { iso_code: "EST" },
  { iso_code: "USA" },
  { iso_code: "ETH" },
  { iso_code: "FRO" },
  { iso_code: "FJI" },
  { iso_code: "PHL" },
  { iso_code: "FIN" },
  { iso_code: "FRA" },
  { iso_code: "GMB" },
  { iso_code: "GAB" },
  { iso_code: "GHA" },
  { iso_code: "GEO" },
  { iso_code: "SGS" },
  { iso_code: "GIB" },
  { iso_code: "GRC" },
  { iso_code: "GRD" },
  { iso_code: "GRL" },
  { iso_code: "GLP" },
  { iso_code: "GUM" },
  { iso_code: "GTM" },
  { iso_code: "GUY" },
  { iso_code: "GUF" },
  { iso_code: "GIN" },
  { iso_code: "GNQ" },
  { iso_code: "GNB" },
  { iso_code: "HTI" },
  { iso_code: "HND" },
  { iso_code: "HKG" },
  { iso_code: "HUN" },
  { iso_code: "YEM" },
  { iso_code: "BVT" },
  { iso_code: "NFK" },
  { iso_code: "CXR" },
  { iso_code: "CYM" },
  { iso_code: "COK" },
  { iso_code: "FLK" },
  { iso_code: "HMD" },
  { iso_code: "MHL" },
  { iso_code: "UMI" },
  { iso_code: "SLB" },
  { iso_code: "TCA" },
  { iso_code: "VIR" },
  { iso_code: "VGB" },
  { iso_code: "CCK" },
  { iso_code: "IDN" },
  { iso_code: "IRN" },
  { iso_code: "IRQ" },
  { iso_code: "IRL" },
  { iso_code: "ISL" },
  { iso_code: "ISR" },
  { iso_code: "ITA" },
  { iso_code: "JAM" },
  { iso_code: "JPN" },
  { iso_code: "DJI" },
  { iso_code: "JOR" },
  { iso_code: "KWT" },
  { iso_code: "LBN" },
  { iso_code: "LBY" },
  { iso_code: "LAO" },
  { iso_code: "LSO" },
  { iso_code: "LVA" },
  { iso_code: "LBR" },
  { iso_code: "LIE" },
  { iso_code: "LTU" },
  { iso_code: "LUX" },
  { iso_code: "MEX" },
  { iso_code: "MCO" },
  { iso_code: "MAC" },
  { iso_code: "MKD" },
  { iso_code: "MDG" },
  { iso_code: "MYS" },
  { iso_code: "MWI" },
  { iso_code: "MDV" },
  { iso_code: "MLI" },
  { iso_code: "MLT" },
  { iso_code: "MNP" },
  { iso_code: "MAR" },
  { iso_code: "MTQ" },
  { iso_code: "MUS" },
  { iso_code: "MRT" },
  { iso_code: "MYT" },
  { iso_code: "FSM" },
  { iso_code: "MOZ" },
  { iso_code: "MDA" },
  { iso_code: "MNG" },
  { iso_code: "MSR" },
  { iso_code: "NER" },
  { iso_code: "NAM" },
  { iso_code: "NRU" },
  { iso_code: "NPL" },
  { iso_code: "NIC" },
  { iso_code: "NGA" },
  { iso_code: "NIU" },
  { iso_code: "NOR" },
  { iso_code: "NCL" },
  { iso_code: "NZL" },
  { iso_code: "OMN" },
  { iso_code: "NLD" },
  { iso_code: "PLW" },
  { iso_code: "PAN" },
  { iso_code: "PNG" },
  { iso_code: "PAK" },
  { iso_code: "PRY" },
  { iso_code: "PER" },
  { iso_code: "PCN" },
  { iso_code: "POL" },
  { iso_code: "PYF" },
  { iso_code: "PRI" },
  { iso_code: "PRT" },
  { iso_code: "KEN" },
  { iso_code: "KGZ" },
  { iso_code: "KIR" },
  { iso_code: "RUS" },
  { iso_code: "GBR" },
  { iso_code: "CAF" },
  { iso_code: "CZE" },
  { iso_code: "DOM" },
  { iso_code: "REU" },
  { iso_code: "ROU" },
  { iso_code: "RWA" },
  { iso_code: "KNA" },
  { iso_code: "SMR" },
  { iso_code: "SPM" },
  { iso_code: "STP" },
  { iso_code: "VCT" },
  { iso_code: "SYR" },
  { iso_code: "SLV" },
  { iso_code: "WSM" },
  { iso_code: "ASM" },
  { iso_code: "SHN" },
  { iso_code: "LCA" },
  { iso_code: "ESH" },
  { iso_code: "SYC" },
  { iso_code: "SEN" },
  { iso_code: "SLE" },
  { iso_code: "SGP" },
  { iso_code: "SOM" },
  { iso_code: "LKA" },
  { iso_code: "SWE" },
  { iso_code: "CHE" },
  { iso_code: "SWZ" },
  { iso_code: "SDN" },
  { iso_code: "SUR" },
  { iso_code: "SJM" },
  { iso_code: "THA" },
  { iso_code: "TWN" },
  { iso_code: "TJK" },
  { iso_code: "TZA" },
  { iso_code: "IOT" },
  { iso_code: "ATF" },
  { iso_code: "TLS" },
  { iso_code: "TGO" },
  { iso_code: "TKL" },
  { iso_code: "TON" },
  { iso_code: "TTO" },
  { iso_code: "TUN" },
  { iso_code: "TKM" },
  { iso_code: "TUR" },
  { iso_code: "TUV" },
  { iso_code: "UKR" },
  { iso_code: "UGA" },
  { iso_code: "URY" },
  { iso_code: "UZB" },
  { iso_code: "VUT" },
  { iso_code: "VAT" },
  { iso_code: "VEN" },
  { iso_code: "VNM" },
  { iso_code: "WLF" },
  { iso_code: "ZMB" },
  { iso_code: "ZWE" },
];

//TODO this could probably be part of the localization engine
function nationCodeToLocalName(
  code: string,
  locale = getLocale(),
  official = false,
) {
  const getTranslationCode = (locale: string) => {
    switch (locale) {
      case "de":
        return "deu";
      case "en":
        return "eng";
      default:
        return "eng";
    }
  };

  const nation = allNations.find((nation) => {
    if (code.length === 2) return nation.cca2 === code.toUpperCase();
    return nation.cca3 === code.toUpperCase();
  });

  if (!nation) {
    return "N/A";
  }

  let translation;

  if (getTranslationCode(locale) == "eng") {
    translation = nation.name;
  } else {
    if (
      !nation.translations ||
      !nation.translations[getTranslationCode(locale)]
    ) {
      return "N/A";
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
export const NationIso3ToLocalNamesMap = new Map<string, TranslationObject>();

for (const nation of allNations) {
  const translationObject: TranslationObject = {} as any;
  for (const locale of locales) {
    translationObject[locale] = nationCodeToLocalName(nation.cca3, locale);
  }
  NationIso3ToLocalNamesMap.set(nation.cca3, translationObject);
}

Object.freeze(NationIso3ToLocalNamesMap);

// we use that index to build the options for the form
export const translatedNationCodeAddressFormOptions = $state(
  addressNations
    .map((nation) => ({
      value: nation.iso_code,
      label: NationIso3ToLocalNamesMap.get(nation.iso_code)![getLocale()],
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .sort((a, b) => (a.value === "DEU" ? -1 : b.value === "DEU" ? 1 : 0)),
);

export const getTranslatedCountryNameFromAlpha3Code = (
  alpha3Code?: string | null,
) => {
  if (!alpha3Code) return "N/A";
  const found = NationIso3ToLocalNamesMap.get(alpha3Code.toUpperCase());
  if (found) return found[getLocale()];

  console.warn("Could not translate country code", alpha3Code);
  return "N/A";
};

export const sortTranslatedCountries = (
  a: { alpha3Code?: string | null; name?: string | null; [key: string]: any },
  b: { alpha3Code?: string | null; name?: string | null; [key: string]: any },
) => {
  if ((!a.alpha3Code && !a.name) || (!b.alpha3Code && !b.name)) return 0;
  return (
    a.name ?? getTranslatedCountryNameFromAlpha3Code(a.alpha3Code)
  ).localeCompare(
    b.name ?? getTranslatedCountryNameFromAlpha3Code(b.alpha3Code),
  );
};
