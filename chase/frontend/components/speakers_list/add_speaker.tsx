import { ToastContext } from "@/contexts/toast";
import { CountryCode } from "@/custom_types/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import Button from "@components/button";
import { faPlus, faTimes } from "@fortawesome/pro-solid-svg-icons";
import Fuse from "fuse.js";
import useMousetrap from "mousetrap-react";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { useContext, useEffect, useState } from "react";
import { SmallFlag } from "../flag_templates";
import CountryAutoComplete from "./country_auto_complete";

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
  const { LL } = useI18nContext();
  const { showToast } = useContext(ToastContext);

  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );

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
        <CountryAutoComplete
          listOfAllCountries={listOfAllCountries}
          placeholder={LL.chairs.speakersList.addSpeakerOverlay.PLACEHOLDER()}
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
          ac
        </div>
      </div>
    </>
  );
}
