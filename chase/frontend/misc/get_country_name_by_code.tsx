import countryData from "data/countries.json";
import { CountryCode } from "@/custom_types";

export default function getCountryNameByCode(
  countryCode: string,
  language: "de" | "en" = "de", // TODO add more languages from i18n solution
): CountryCode {
  const country = countryData.find((item) => item.alpha3 === countryCode);

  if (country) {
    // TODO Fix bug with types
    // @ts-ignore
    return country[language] || country.en; // Use English as a fallback language
  }

  return "xxx"; // Country not found
}
