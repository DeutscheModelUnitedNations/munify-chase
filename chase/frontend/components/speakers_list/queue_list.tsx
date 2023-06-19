import React from "react";
import { CountryCode, SpeakersListData } from "@/custom_types";
import Timeline from "@components/speakers_list/timeline";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import WidgetBoxTemplate from "../widget_box_template";
import { NormalFlag as Flag } from "@components/flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";

export default function QueueList({
  list,
  myCountry,
  closed,
}: SpeakersListData & { myCountry: CountryCode; closed: boolean }) {
  /**
   * This Component is used in the Speakers List and Comment List on the Speakers List Page.
   * It uses the Timeline Component to create a list of countries.
   * If no countries are in the list, it displays a message.
   * If the list is closed, it displays a border at the bottom, that indicates the closed state of the list.
   */

  const { LL, locale } = useI18nContext();

  return (
    <>
      <div className="flex flex-col mt-3">
        <Timeline
          list={list}
          content={(item) => {
            return <CountryCard countryCode={item} myCountry={myCountry} />;
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
}: { countryCode: CountryCode; myCountry: CountryCode }) {
  const { LL, locale } = useI18nContext();

  return (
    <WidgetBoxTemplate highlight={countryCode === myCountry}>
      <Flag countryCode={countryCode} />
      <div className="flex flex-col justify-center">
        <div className="text-sm font-bold text-gray-text">
          {getCountryNameByCode(countryCode, locale)}
        </div>
      </div>
    </WidgetBoxTemplate>
  );
}
