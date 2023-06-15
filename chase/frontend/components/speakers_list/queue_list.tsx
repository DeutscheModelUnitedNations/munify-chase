import React from "react";
import { CountryCode, SpeakersListData } from "@/custom_types";
import Timeline from "@components/speakers_list/timeline";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import WidgetBoxTemplate from "../widget_box_template";
import { NormalFlag as Flag } from "@components/flag_templates";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function QueueList({
  list,
  myCountry,
  closed,
}: SpeakersListData & { myCountry: CountryCode; closed: boolean }) {
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
            <div className="flex-1 border border-gray-500" />
            <div className="text-sm font-bold text-gray-500">
              {LL.participants.speakersList.LIST_CLOSED_MESSAGE()}
            </div>
            <div className="flex-1 border border-gray-500" />
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
        <div className="text-sm font-bold">
          {getCountryNameByCode(countryCode, locale)}
        </div>
      </div>
    </WidgetBoxTemplate>
  );
}
