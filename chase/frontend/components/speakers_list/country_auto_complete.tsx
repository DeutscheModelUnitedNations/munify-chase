import { Alpha3Code, CountryCode } from "@/custom_types/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import Fuse from "fuse.js";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { useContext, useEffect, useRef, useState } from "react";
import { SmallFlag } from "../flag_templates";
import { toastError } from "@/fetching/fetching_utils";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import {
  ConferenceIdContext,
  CommitteeIdContext,
} from "@/contexts/committee_data";

interface CountryData {
  alpha3: CountryCode;
  name: string;
}

type AllCountriesData = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["committee"]["committeeId"]["allCountryCodes"]
  >
>["data"];

export default function CountryAutoComplete({
  allCountries,
  selectedCountry,
  setSelectedCountry,
  placeholder,
}: {
  allCountries: AllCountriesData | null;
  selectedCountry: CountryData | null;
  setSelectedCountry: (country: CountryData | null) => void;
  placeholder: string;
}) {
  const { LL, locale } = useI18nContext();
  const toast = useRef<Toast>(null);

  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const [countries, setCountries] = useState<CountryData[] | null>(null);
  const [query, setQuery] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<CountryData[]>([]);
  const [fuse, setFuse] = useState<Fuse<CountryData> | null>(null);

  useEffect(() => {
    if (!allCountries) return;
    const countryData: CountryData[] = allCountries.map((country: string) => {
      return {
        alpha3: country,
        name: getCountryNameByCode(country, locale),
      };
    });
    setCountries(countryData);

    const options = {
      keys: ["name", "alpha3"],
      includeScore: true,
    };
    setFuse(new Fuse(countryData, options));
  }, [allCountries, locale]);

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
    <>
      <Toast ref={toast} />
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
    </>
  );
}
