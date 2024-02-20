"use client";
import React, { useEffect, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { apiTestData } from "@/test_data";
import { useI18nContext } from "@/i18n/i18n-react";
import SpeakersListBlock from "@/components/speakers_list/speakers_list_block";
import { ParticipantSpeechButtons } from "@/components/speakers_list/speech_buttons";
import { $Enums } from "../../../../../../../../backend/prisma/generated/client";

export default function SpeakersList() {
  const { LL } = useI18nContext();

  const [data, setData] = useState(apiTestData);

  useEffect(() => {
    const intervalAPICall = setInterval(() => {
      setData(apiTestData);
    }, 1000);
    return () => clearInterval(intervalAPICall);
  }, []);

  return (
    <>
      <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex p-4 gap-4 flex-col lg:flex-row">
          <SpeakersListBlock
            typeOfList={$Enums.SpeakersListCategory.SPEAKERS_LIST}
            listTitle={LL.participants.speakersList.SPEAKERS_LIST()}
            myCountry={data.myCountry}
          >
            <ParticipantSpeechButtons
              onSpeakersList={
                data.speakersList.list.find(
                  (item) => item.countryCode === data.myCountry,
                ) !== undefined
              }
              listClosed={data.speakersList.closed}
            />
          </SpeakersListBlock>
          <SpeakersListBlock
            typeOfList={$Enums.SpeakersListCategory.COMMENT_LIST}
            listTitle={LL.participants.speakersList.COMMENT_LIST()}
            myCountry={data.myCountry}
          >
            <ParticipantSpeechButtons
              onSpeakersList={
                data.commentList.list.find(
                  (item) => item.countryCode === data.myCountry,
                ) !== undefined
              }
              listClosed={data.commentList.closed}
            />
          </SpeakersListBlock>
        </div>
      </ScrollPanel>
    </>
  );
}
