"use client";
import React, { useEffect, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import SpeakerQueueList from "@/components/speakers_list/queue_list";
import { CountryCode } from "@/custom_types";
import { Button } from "primereact/button";
import { faBan, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpeakersListData } from "@/custom_types";
import { apiTestData } from "@/test_data";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function SpeakersList() {
  const { LL } = useI18nContext();

  const [data, setData] = useState(apiTestData);

  useEffect(() => {
    const intervalAPICall = setInterval(() => {
      console.log("API Call");
      setData(apiTestData);
    }, 1000);
    return () => clearInterval(intervalAPICall);
  }, []);

  return (
    <>
      <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex p-4 gap-4 md:flex-col lg:flex-row">
          <SpeakersListBlock
            listTitle={LL.participants.speakersList.SPEAKERS_LIST()}
            speakersData={data.speakersList}
            myCountry={data.myCountry}
          />
          <SpeakersListBlock
            listTitle={LL.participants.speakersList.COMMENT_LIST()}
            speakersData={data.commentList}
            myCountry={data.myCountry}
          />
        </div>
      </ScrollPanel>
    </>
  );
}

function SpeechButtons({
  onSpeakersList,
  listClosed,
}: { onSpeakersList: boolean; listClosed: boolean }) {
  const { LL } = useI18nContext();

  return (
    <div className="flex flex-col gap-2 items-start justify-center mt-3">
      {onSpeakersList && (
        <Button
          label={LL.participants.speakersList.REMOVE_FROM_LIST_BUTTON()}
          icon={<FontAwesomeIcon icon={faBan} className="mr-2" />}
          size="small"
          severity="danger"
        />
      )}
      {!onSpeakersList && (
        <Button
          label={
            listClosed
              ? LL.participants.speakersList.LIST_CLOSED_BUTTON()
              : LL.participants.speakersList.ADD_TO_LIST_BUTTON()
          }
          icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />}
          size="small"
          disabled={listClosed}
        />
      )}
    </div>
  );
}

function SpeakersListBlock({
  listTitle,
  speakersData,
  myCountry,
}: {
  listTitle: string;
  speakersData: SpeakersListData;
  myCountry: CountryCode;
}) {
  const { LL } = useI18nContext();

  const myCountryInList: () => boolean = () => {
    if (speakersData.list.find((item) => item.countryCode === myCountry)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <WidgetTemplate cardTitle={listTitle}>
      {speakersData.currentSpeaker ? (
        <>
          <SpeakerBlock {...speakersData.currentSpeaker} />
          <SpeechButtons
            listClosed={speakersData.closed}
            onSpeakersList={myCountryInList()}
          />
          <SpeakerQueueList {...speakersData} myCountry={myCountry} />
        </>
      ) : (
        <div className="flex flex-col gap-2 items-start justify-center mt-3">
          <p className="text-gray-500 text-sm mb-3">
            {LL.participants.speakersList.NO_SPEAKERS_MESSAGE()}
          </p>
          <Button
            label={LL.participants.speakersList.ADD_TO_LIST_BUTTON()}
            icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />}
            size="small"
            disabled={speakersData.closed}
          />
        </div>
      )}
    </WidgetTemplate>
  );
}
