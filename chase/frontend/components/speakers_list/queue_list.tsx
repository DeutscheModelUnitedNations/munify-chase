import React, { useState, useEffect, useContext } from "react";
import Timeline from "@components/speakers_list/timeline";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import WidgetBoxTemplate from "../widget_box_template";
import { NormalFlag as Flag } from "@components/flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  faChevronDown,
  faChevronUp,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import Button from "@components/button";
import { backend } from "@/services/backend";
import { SpeakersListDataContext } from "@/contexts/speakers_list_data";

/**
 * This Component is used in the Speakers List and Comment List on the Speakers List Page.
 * It uses the Timeline Component to create a list of countries.
 * If no countries are in the list, it displays a message.
 * If the list is closed, it displays a border at the bottom, that indicates the closed state of the list.
 */

export default function QueueList({
  myCountry,
  chairOptions = false,
}: {
  myCountry?: string;
  chairOptions?: boolean;
}) {
  const { LL } = useI18nContext();

  const speakersListData = useContext(SpeakersListDataContext);

  return (
    <>
      <div className="flex flex-col mt-3">
        <Timeline
          list={
            speakersListData?.speakers &&
            (speakersListData?.speakers.length > 1
              ? speakersListData?.speakers.slice(1)
              : [])
          }
          content={(item) => {
            return (
              <CountryCard
                speakerData={item}
                myCountry={myCountry}
                chairOptions={chairOptions}
                isLast={
                  speakersListData?.speakers &&
                  item.id ===
                    speakersListData.speakers[
                      speakersListData.speakers.length - 1
                    ].id
                }
              />
            );
          }}
        />
        {speakersListData?.isClosed && (
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
  speakerData,
  myCountry,
  chairOptions = false,
  isLast,
}: {
  speakerData: SpeakersListData.speakers[number];
  myCountry?: string;
  chairOptions?: boolean;
  isLast?: boolean;
}) {
  const { locale } = useI18nContext();

  const listId = useContext(SpeakersListDataContext)?.id;

  const [alpha3Code, setAlpha3Code] = useState<string | undefined>(undefined);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (!speakerData?.committeeMember?.delegation?.nation.alpha3Code) return;
    setAlpha3Code(speakerData.committeeMember.delegation.nation.alpha3Code);
  }, [speakerData]);

  return (
    <WidgetBoxTemplate highlight={alpha3Code === myCountry}>
      <Flag countryCode={alpha3Code} />
      <div className="flex flex-col justify-center">
        <div className="text-sm font-bold text-gray-text dark:text-primary-800">
          {alpha3Code && getCountryNameByCode(alpha3Code, locale)}
        </div>
      </div>
      <div className="flex-1" />
      {chairOptions && (
        <>
          {/* TODO Find more intuitive way to change the oder of the list */}
          <Button
            faIcon={faChevronUp}
            onClick={async () => {
              if (!listId) return;
              await backend.speakersList[listId].moveSpeaker[
                speakerData.id
              ].up.post();
            }}
            text
            size="small"
          />
          <Button
            faIcon={faChevronDown}
            onClick={async () => {
              if (!listId) return;
              await backend.speakersList[listId].moveSpeaker[
                speakerData.id
              ].down.post();
            }}
            text
            size="small"
            disabled={isLast}
          />
          <Button
            faIcon={faXmark}
            onClick={async () => {
              if (!listId) return;
              setLoadingDelete(true);
              await backend.speakersList[listId].removeSpeaker[
                speakerData.id
              ].delete();
            }}
            text
            size="small"
            severity="danger"
            loading={loadingDelete}
          />
        </>
      )}
    </WidgetBoxTemplate>
  );
}
