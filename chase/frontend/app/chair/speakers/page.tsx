"use client";
import React, { useEffect, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { apiTestData } from "@/test_data";
import { useI18nContext } from "@/i18n/i18n-react";
import SpeakersListBlock from "@/components/speakers_list/speakers_list_block";
import { ChairSpeechButtons } from "@/components/speakers_list/speech_buttons";
import { ToastProvider } from "@/contexts/messages/toast";

export default function ChairSpeakersList() {
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
      <ToastProvider>
        <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex-1 flex p-4 gap-4 flex-col lg:flex-row">
            <SpeakersListBlock
              listTitle={LL.participants.speakersList.SPEAKERS_LIST()}
              speakersData={data.speakersList}
              myCountry={data.myCountry}
              chairOptions={true}
            >
              <ChairSpeechButtons
                listClosed={data.speakersList.closed}
                timerPaused={data.speakersList.currentSpeaker.timer.paused}
                nextSpeakerQueued={data.speakersList.list.length > 0}
                activeSpeaker={
                  data.speakersList.currentSpeaker.countryCode ? true : false
                }
                listOfAllCountries={data.speakersList.listOfAllCountries}
                typeOfList={LL.participants.speakersList.SPEAKERS_LIST()}
                isCommentList={false}
              />
            </SpeakersListBlock>
            <SpeakersListBlock
              listTitle={LL.participants.speakersList.COMMENT_LIST()}
              speakersData={data.commentList}
              myCountry={data.myCountry}
              chairOptions={true}
            >
              <ChairSpeechButtons
                listClosed={data.commentList.closed}
                timerPaused={data.commentList.currentSpeaker.timer.paused}
                nextSpeakerQueued={data.commentList.list.length > 0}
                activeSpeaker={
                  data.commentList.currentSpeaker.countryCode ? true : false
                }
                listOfAllCountries={data.speakersList.listOfAllCountries}
                typeOfList={LL.participants.speakersList.COMMENT_LIST()}
                isCommentList={true}
              />
            </SpeakersListBlock>
          </div>
        </ScrollPanel>
      </ToastProvider>
    </>
  );
}
