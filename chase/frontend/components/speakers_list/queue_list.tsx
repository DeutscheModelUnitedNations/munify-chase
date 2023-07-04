import React from "react";
import { CountryCode, SpeakersListData } from "@/custom_types";
import Timeline from "@components/speakers_list/timeline";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import WidgetBoxTemplate from "../widget_box_template";
import { NormalFlag as Flag } from "@components/flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faDiagramNext,
  faGripVertical,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "primereact/button";

/**
 * This Component is used in the Speakers List and Comment List on the Speakers List Page.
 * It uses the Timeline Component to create a list of countries.
 * If no countries are in the list, it displays a message.
 * If the list is closed, it displays a border at the bottom, that indicates the closed state of the list.
 */

export default function QueueList({
  list,
  myCountry,
  closed,
  chairOptions = false,
}: SpeakersListData & {
  myCountry?: CountryCode;
  closed: boolean;
  chairOptions?: boolean;
}) {
  const { LL, locale } = useI18nContext();

  return (
    <>
      <div className="flex flex-col mt-3">
        <Timeline
          list={list}
          content={(item) => {
            return (
              <CountryCard
                countryCode={item}
                myCountry={myCountry}
                chairOptions={chairOptions}
              />
            );
          }}
        />
        {closed && (
          <div className="flex justify-stretch items-center gap-3 mt-3">
            <div className="flex-1 border border-gray-text" />
            <div className="text-sm font-bold text-gray-text">
              {LL.participants.speakersList.LIST_CLOSED_MESSAGE()}
            </div>
            <div className="flex-1 border border-gray-text" />
          </div>
        )}
      </div>
    </>
  );
}

function CountryCard({
  countryCode,
  myCountry,
  chairOptions = false,
}: {
  countryCode: CountryCode;
  myCountry?: CountryCode;
  chairOptions?: boolean;
}) {
  const { LL, locale } = useI18nContext();

  return (
    <WidgetBoxTemplate highlight={countryCode === myCountry}>
      <Flag countryCode={countryCode} />
      <div className="flex flex-col justify-center">
        <div className="text-sm font-bold text-gray-text dark:text-primary-800">
          {getCountryNameByCode(countryCode, locale)}
        </div>
      </div>
      <div className="flex-1" />
      {chairOptions && (
        <>
          {/* TODO Find intuitive way to change the oder of the list */}
          <Button
            icon={<FontAwesomeIcon icon={faXmark} />}
            text
            severity="danger"
            size="small"
          />
        </>
      )}
    </WidgetBoxTemplate>
  );
}
