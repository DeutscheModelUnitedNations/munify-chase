import countryData from "data/countries.json";
import { CountryCode } from "@/custom_types";

export default function getCountryNameByCode(
  countryCode: string,
  language: "de" | "en" = "de", // TODO add more languages
) {
  const country = countryData.find((item) => item.alpha3 === countryCode);

  if (country) {
    return country[language] || country.en; // Use English as a fallback language
  }

  return "!CountryNotFound!"; // Country not found
}
