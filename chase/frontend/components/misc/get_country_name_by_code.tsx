import countryData from "data/countries.json";

export default function getCountryNameByCode(countryCode: string, language = "de") {
  const country = countryData.find((item) => item.alpha3 === countryCode);
    
  if (country) {
    return country[language] || country.en; // Use English as a fallback language
  }
  
  return "!CountryNotFound!"; // Country not found
}