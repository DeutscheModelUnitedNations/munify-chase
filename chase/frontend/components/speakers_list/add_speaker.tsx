import React, { useContext, useEffect, useState } from "react";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { useI18nContext } from "@/i18n/i18n-react";
import Button from "@components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/pro-solid-svg-icons";
import { SmallFlag } from "../flag_templates";
import { CountryCode } from "@/custom_types";
import Fuse from "fuse.js";
import { ToastContext } from "@/contexts/messages/toast";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import useMousetrap from "mousetrap-react";

interface CountryData {
  alpha3: CountryCode;
  name: string;
}

/**
 * This component is used to display the overlay to add a speaker to the Speakers List on the Speakers List Page for chairs.
 * It uses the AutoComplete Component from PrimeReact.
 * The overlay is displayed when the user clicks on the Add Speaker Button.
 * The user can search for a country by name or by code.
 * The user can select a country from the list of suggestions.
 * The user can click on the Add Speaker Button to add the speaker and keep the overlay open, or click on the Add and Close Button to add the speaker and close the overlay.
 * Instead of clicking on the Add Speaker Button, the user can press the Enter key after selecting a country to trigger the same action.
 * Note: Not only countries can be added to the Speakers List, but also Non-State Actors and als UN Staff like the Secretary-General (Country-Code: unm / unw (male/female))
 */

// TODO add toast functionality for when a speaker is added or already on the list
// TODO add warning when a speaker is added to the list and the list is closed

export default function AddSpeakerOverlay({
  listOfAllCountries,
  _listClosed,
  closeOverlay,
  typeOfList,
}: {
  listOfAllCountries: CountryCode[];
  _listClosed: boolean;
  closeOverlay: () => void;
  typeOfList: string;
}) {
  const { LL, locale } = useI18nContext();
  const { showToast } = useContext(ToastContext);

  const [countries, setCountries] = useState<CountryData[] | null>(null);
  const [query, setQuery] = useState<string>("");
  const [filteredCountries, setFilteredCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );
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

    let filteredCountries;
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

  const sendAddSpeaker = () => {
    if (selectedCountry) {
      showToast({
        severity: "success",
        summary: LL.chairs.speakersList.addSpeakerOverlay.TOAST_ADDED_SUMMARY(
          selectedCountry.name,
        ),
        detail:
          LL.chairs.speakersList.addSpeakerOverlay.TOAST_ADDED_DETAIL(
            typeOfList,
          ),
        sticky: false,
      });
      setSelectedCountry(null);
    }
  };

  useMousetrap("esc", () => closeOverlay());

  useMousetrap("enter", () => {
    if (selectedCountry?.alpha3) {
      sendAddSpeaker();
    }
  });

  useMousetrap("shift+enter", () => {
    if (selectedCountry?.alpha3) {
      sendAddSpeaker();
      closeOverlay();
    }
  });

  return (
    <>
      <div className="flex flex-col gap-5 mt-1">
        <AutoComplete
          value={selectedCountry}
          suggestions={filteredCountries}
          completeMethod={searchCountry}
          field={"name"}
          onChange={(e) => setSelectedCountry(e.value)}
          dropdown
          dropdownMode="blank"
          itemTemplate={countryTemplate}
          placeholder={LL.chairs.speakersList.addSpeakerOverlay.PLACEHOLDER()}
          autoFocus
          autoHighlight
          forceSelection
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              closeOverlay();
            } else if (e.key === "Enter" && e.shiftKey) {
              if (selectedCountry?.alpha3) {
                sendAddSpeaker();
                closeOverlay();
              }
            } else if (e.key === "Enter") {
              if (selectedCountry?.alpha3) {
                sendAddSpeaker();
              }
            }
          }}
        />
        <div className="flex gap-3 justify-end flex-wrap">
          <Button
            label={LL.chairs.speakersList.addSpeakerOverlay.BUTTON_CANCEL()}
            faIcon={faTimes}
            onClick={closeOverlay}
            severity="danger"
            text
            keyboardShortcut="Esc"
          />
          <Button
            label={LL.chairs.speakersList.addSpeakerOverlay.BUTTON_ADD_AND_CLOSE()}
            faIcon={faPlus}
            onClick={() => {
              sendAddSpeaker();
              closeOverlay();
            }}
            text
            keyboardShortcut="⇧ + ⏎"
          />
          <Button
            label={LL.chairs.speakersList.addSpeakerOverlay.BUTTON_ADD()}
            faIcon={faPlus}
            onClick={() => {
              sendAddSpeaker();
              setSelectedCountry(null);
            }}
            keyboardShortcut="⏎"
          />
        </div>
      </div>
    </>
  );
}
