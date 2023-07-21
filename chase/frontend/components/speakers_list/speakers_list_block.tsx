import React from "react";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import SpeakerQueueList from "@/components/speakers_list/queue_list";
import { CountryCode } from "@/custom_types";

import { SpeakersListData } from "@/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import NoDataPlaceholder from "../no_data_placeholder";

/**
 * This Component is used in the Speakers List and Comment List on the Speakers List Page.
 * It uses the SpeakerBlock Component to display the list with the adequate options for chairs, participants and observers.
 * If no speakers are in the list, it displays a message.
 * If the list is closed, it displays a border at the bottom, that indicates the closed state of the list.
 */

export default function SpeakersListBlock({
  listTitle,
  speakersData,
  myCountry,
  chairOptions = false,
  children,
}: {
  listTitle: string;
  speakersData: SpeakersListData;
  myCountry?: CountryCode;
  chairOptions?: boolean;
  children?: React.ReactNode;
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
          {children}
          <SpeakerQueueList
            {...speakersData}
            myCountry={myCountry}
            chairOptions={chairOptions}
          />
        </>
      ) : (
        <div className="flex flex-col gap-2 items-start justify-center mt-3">
          <NoDataPlaceholder
            title={LL.participants.speakersList.NO_SPEAKERS_MESSAGE()}
          />
          {children}
        </div>
      )}
    </WidgetTemplate>
  );
}
