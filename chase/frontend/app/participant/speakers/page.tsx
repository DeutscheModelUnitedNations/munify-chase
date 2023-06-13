"use client";
import React from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import SpeakerQueueList from "@/components/speakers_list/cueue_list";
import { CountryCode } from "@/custom_types";
import { Button } from "primereact/button";
import { faBan, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Speaker {
  countryCode: CountryCode;
  customName?: string;
  time: string;
}

export default function participant_dashboard() {
  const myCountryInList: (list: CountryCode[]) => boolean = (list) => {
    if (list.find((countryCode) => countryCode === myCountry)) {
      return true
    } else {
      return false
    }
  }


  const myCountry: CountryCode = "cpv";

  const currentSpeaker: Speaker = {
    countryCode: "unw",
    time: "2:35",
  };

  const speakersList: CountryCode[] = ["gbr", "che", "yem", "fra", "jam", "cpv", "gmb", "jor", "lao", "ltu", "fsm", "omn", "qat", "sle", "sdn", "tls", "are", "ven"];

  const speakersListClosed: boolean = false;

  const currentComment: Speaker = {
    countryCode: "cze",
    time: "0:23",
  };

  // const currentComment = null;  // If there is no data for current comment, the commentlist block will not be rendered

  const commentList: CountryCode[] = ["deu", "jam", "usa", "yem"];
  // const commentList: CountryCode[] = [];

  const commentListClosed: boolean = true;

  return (
    <>
      <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex-1 flex p-4 gap-4 md:flex-col lg:flex-row">
          <WidgetTemplate cardTitle="Redeliste">
            { currentSpeaker ? (
              <>
                <SpeakerBlock countryCode={currentSpeaker.countryCode} time={currentSpeaker.time} />
                <SpeechButtons
                  listClosed={speakersListClosed}
                  onSpeakersList={myCountryInList(speakersList)}
                />
                <SpeakerQueueList list={speakersList} myCountry={myCountry} closed={speakersListClosed} />  
              </>
            ) : (
                <div className="flex flex-col gap-2 items-start justify-center mt-3">
                  <p className="text-gray-500 text-sm mb-3">Kein Redebeitrag</p>
                  <Button label="Redebeitrag" icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />} size="small" disabled={commentListClosed} />
                </div>
            )
            }
          </WidgetTemplate>
          <WidgetTemplate cardTitle="Fragen u. Kurzberemerkungen">
            { currentComment ? (
              <>
                <SpeakerBlock countryCode={currentComment.countryCode} time={currentComment.time} />
                <SpeechButtons
                  listClosed={commentListClosed}
                  onSpeakersList={myCountryInList(commentList)}
                />
                <SpeakerQueueList list={commentList} myCountry={myCountry} closed={commentListClosed} />
              </>
            ) : (
              <div className="flex flex-col gap-2 items-start justify-center mt-3">
                <p className="text-gray-500 text-sm mb-3">Kein Frage oder Kurzbemerkung</p>
                <Button label="Redebeitrag" icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />} size="small" disabled={commentListClosed} />
              </div>
            )
            }
          </WidgetTemplate>
        </div>
      </ScrollPanel>
    </>
  );
}

function SpeechButtons({ onSpeakersList, listClosed }: { onSpeakersList: boolean, listClosed: boolean }) {
  return (
    <div className="flex flex-col gap-2 items-start justify-center mt-3">
      {onSpeakersList && <Button label="Zurückziehen" icon={<FontAwesomeIcon icon={faBan} className="mr-2" />} size="small" severity="danger" />}
      {!onSpeakersList && <Button label="Redebeitrag" icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />} size="small" disabled={listClosed} />}
    </div>
  );
}