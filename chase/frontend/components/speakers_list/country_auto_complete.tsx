import { Alpha3Code, CountryCode } from "@/custom_types/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import Fuse from "fuse.js";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { useEffect, useState } from "react";
import { SmallFlag } from "../flag_templates";

interface CountryData {
  alpha3: CountryCode;
  name: string;
}

export default function CountryAutoComplete({
  listOfAllCountries,
  selectedCountry,
  setSelectedCountry,
  placeholder,
}: {
  listOfAllCountries: Alpha3Code[];
  selectedCountry: CountryData | null;
  setSelectedCountry: (country) => void;
  placeholder: string;
}) {
  const { LL, locale } = useI18nContext();
  const [countries, setCountries] = useState<CountryData[] | null>(null);
  const [query, setQuery] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<CountryData[]>([]);
  const [fuse, setFuse] = useState<Fuse<CountryData> | null>(null);

  useEffect(() => {
    if (!listOfAllCountries) return;
    const countryData: CountryData[] = listOfAllCountries.map(
      (country: CountryCode) => {
        return {
          alpha3: country,
          name: getCountryNameByCode(country, locale),
        };
      },
    );
    setCountries(countryData);

    const options = {
      keys: ["name", "alpha3"],
      includeScore: true,
    };
    setFuse(new Fuse(countryData, options));
  }, [listOfAllCountries, locale]);

  useEffect(() => {
    if (selectedCountry) {
      setQuery(selectedCountry.name);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (query === "") {
      setSelectedCountry(null);
    } else {
      const country = countries?.find((country) => country.name === query);
      if (country) {
        setSelectedCountry(country);
      }
    }
  }, [query]);

  const searchCountry = (event: AutoCompleteCompleteEvent) => {
    if (!fuse) return;

    let filteredCountries: CountryData[] = [];
    if (!event.query.trim().length) {
      filteredCountries = countries ? [...countries] : [];
    } else {
      const results = fuse.search(event.query);
      filteredCountries = results.map((result) => result.item);
    }
    setFilteredCountries(filteredCountries);
  };

  const countryTemplate = (item: CountryData) => {
    return (
      <div className="flex items-center">
        <SmallFlag countryCode={item.alpha3} />
        <div className="ml-2">{item.name}</div>
      </div>
    );
  };

  return (
    <AutoComplete
      value={selectedCountry}
      suggestions={filteredCountries}
      completeMethod={searchCountry}
      field={"name"}
      onChange={(e) => setSelectedCountry(e.value)}
      dropdown
      dropdownMode="blank"
      itemTemplate={countryTemplate}
      placeholder={placeholder}
      autoFocus
      autoHighlight
      forceSelection
    />
  );
}
