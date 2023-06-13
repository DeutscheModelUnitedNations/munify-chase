"use client";
import React, { useEffect, useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import SpeakerQueueList from "@/components/speakers_list/cueue_list";
import { CountryCode } from "@/custom_types";
import { Button } from "primereact/button";
import { faBan, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpeakersListData } from "@/custom_types";
import { apiTestData } from "@/test_data";

export default function SpeakersList() {
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
            listTitle="Rednerliste"
            speakersData={data.speakersList}
            myCountry={data.myCountry}
          />
          <SpeakersListBlock
            listTitle="Fragen und Kurzbemerkungen"
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
  return (
    <div className="flex flex-col gap-2 items-start justify-center mt-3">
      {onSpeakersList && (
        <Button
          label="Zurückziehen"
          icon={<FontAwesomeIcon icon={faBan} className="mr-2" />}
          size="small"
          severity="danger"
        />
      )}
      {!onSpeakersList && (
        <Button
          label="Redebeitrag"
          icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />}
          size="small"
          disabled={listClosed}
        />
      )}
    </div>
  );
}

// TODO Idea: Create a functionality to add as many speakers lists as needed (not only two fixed ones)
function SpeakersListBlock({
  listTitle,
  speakersData,
  myCountry,
}: {
  listTitle: string;
  speakersData: SpeakersListData;
  myCountry: CountryCode;
}) {
  const myCountryInList: () => boolean = () => {
    if (speakersData.list.find((countryCode) => countryCode === myCountry)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <WidgetTemplate cardTitle={listTitle}>
      {speakersData.currentSpeaker ? (
        <>
          <SpeakerBlock
            countryCode={speakersData.currentSpeaker.countryCode}
            timer={speakersData.currentSpeaker.timer}
          />
          <SpeechButtons
            listClosed={speakersData.closed}
            onSpeakersList={myCountryInList()}
          />
          <SpeakerQueueList
            list={speakersData.list}
            myCountry={myCountry}
            closed={speakersData.closed}
          />
        </>
      ) : (
        <div className="flex flex-col gap-2 items-start justify-center mt-3">
          <p className="text-gray-500 text-sm mb-3">
            Kein Beitrag auf der Liste
          </p>
          <Button
            label="Redebeitrag"
            icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />}
            size="small"
            disabled={speakersData.closed}
          />
        </div>
      )}
    </WidgetTemplate>
  );
}
