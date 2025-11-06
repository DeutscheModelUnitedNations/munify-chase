import worldCountries from "world-countries";

const regionalGroupMapping: Record<
  (typeof worldCountries)[0]["unRegionalGroup"],
  RegionalGroupEnum$options | undefined
> = {
  "African Group": "AFRICA",
  "Asia and the Pacific Group": "ASIA_PACIFIC",
  "Eastern European Group": "EASTERN_EUROPE",
  "Latin American and Caribbean Group": "LATIN_AMERICA_CARIBBEAN",
  "Western European and Others Group": "WESTERN_EUROPE_OTHERS",
  "": undefined,
};

export function getCountryData(alpha2Code: string) {
  const country = worldCountries.find(
    (country) => country.cca2.toLowerCase() === alpha2Code.toLowerCase(),
  );
  if (!country) {
    throw new Error(`Country with alpha2 code ${alpha2Code} not found`);
  }
  return {
    alpha3Code: country.cca3.toLowerCase(),
    alpha2Code: country.cca2.toLowerCase(),
    type: "DELEGATION" as RepresentationTypeEnum$options,
    regionalGroup: regionalGroupMapping[country.unRegionalGroup],
  };
}
