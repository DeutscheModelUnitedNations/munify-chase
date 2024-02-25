import countryData from "data/countries.json";
import { CountryCode } from "@/custom_types/custom_types";

/**
 * This function is used to get the name of a country in a given language.
 * It uses the country code to find the country in the countries.json file.
 * If the country is not found, it returns "xxx".
 * If the language is not found or specified, it returns the English name.
 */

export default function getCountryNameByCode(
  countryCode: string | null | undefined,
  locale: string,
): CountryCode {
  const availableLanguages = [
    "ar",
    "bg",
    "cs",
    "da",
    "de",
    "el",
    "en",
    "eo",
    "es",
    "et",
    "eu",
    "fi",
    "fr",
    "hr",
    "hu",
    "hy",
    "it",
    "ja",
    "ko",
    "lt",
    "nl",
    "no",
    "pl",
    "pt",
    "ro",
    "ru",
    "sk",
    "sl",
    "sr",
    "sv",
    "th",
    "uk",
    "zh",
    "zh-tw",
  ];

  let languageCode = locale.split("-")[0];

  if (availableLanguages.includes(languageCode) === false) {
    languageCode = "en";
  }

  const country = countryData.find(
    (item) => item.alpha3 === (countryCode?.toLowerCase() || "xxx"),
  );

  if (country) {
    // TODO Fix bug with types
    // @ts-ignore
    return country[languageCode] || country.en; // Use English as a fallback language
  }

  return "xxx"; // Country not found
}
