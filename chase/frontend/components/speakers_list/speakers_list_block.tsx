import React, { useRef, useContext, useEffect } from "react";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import SpeakerQueueList from "@/components/speakers_list/queue_list";
import { CountryCode } from "@/custom_types/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { SpeakersListDataProvider } from "@/contexts/speakers_list_data";
import { $Enums } from "../../../backend/prisma/generated/client";

export type SpeakersListData = Awaited<
  ReturnType<(typeof backend.speakersList)["speakersListId"]["get"]>
>["data"];

/**
 * This Component is used in the Speakers List and Comment List on the Speakers List Page.
 * It uses the SpeakerBlock Component to display the list with the adequate options for chairs, participants and observers.
 * If no speakers are in the list, it displays a message.
 * If the list is closed, it displays a border at the bottom, that indicates the closed state of the list.
 */

export default function SpeakersListBlock({
  typeOfList,
  listTitle,
  myCountry,
  chairOptions = false,
  children,
}: {
  typeOfList: $Enums.SpeakersListCategory;
  listTitle: string;
  myCountry?: CountryCode;
  chairOptions?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <SpeakersListDataProvider typeOfList={typeOfList}>
      <div className="flex w-full h-full flex-col bg-primary-950 dark:bg-primary-200 rounded-lg p-3 transition-all duration-500">
        <div className="font-bold mb-2 text-lg">{listTitle}</div>
        <SpeakerBlock />
        {children}
        <SpeakerQueueList myCountry={myCountry} chairOptions={chairOptions} />
      </div>
    </SpeakersListDataProvider>
  );
}
