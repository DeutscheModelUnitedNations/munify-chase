import React, { useState, useRef, useEffect, useContext } from "react";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import SpeakerQueueList from "@/components/speakers_list/queue_list";
import { CountryCode } from "@/custom_types/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import NoDataPlaceholder from "../no_data_placeholder";
import { backend } from "@/services/backend";
import { toastError } from "@/fetching/fetching_utils";
import { Toast } from "primereact/toast";
import {
  SpeakersListDataContext,
  SpeakersListIdContext,
} from "@/contexts/speakers_list_data";
import {
  ConferenceIdContext,
  CommitteeIdContext,
} from "@/contexts/committee_data";
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
  const { LL } = useI18nContext();
  const toast = useRef<Toast>(null);
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const [speakersListData, setSpeakersListData] =
    useState<SpeakersListData | null>(null);
  const [listId, setListId] = useState<string | null>(null);

  async function getSpeakersListData() {
    if (!listId) return;
    await backend.speakersList[listId]
      .get()
      .then((response) => {
        if (response.status !== 200)
          throw new Error("Error fetching speakers list data");
        setSpeakersListData(response.data);
      })
      .catch((error) => {
        toastError(toast, LL, error);
        console.error(error);
      });
  }

  async function getSpeakersListId() {
    if (!conferenceId || !committeeId) return;
    await backend.conference[conferenceId].committee[
      committeeId
    ].agendaItem.active[typeOfList]
      .get()
      .then((response) => {
        if (response.status !== 200)
          throw new Error("Error fetching speakers list id");
        setListId(response?.data?.id || null);
      })
      .catch((error) => {
        toastError(toast, LL, error);
        console.error(error);
      });
  }

  useEffect(() => {
    getSpeakersListId();
    const APIinterval = setInterval(() => {
      getSpeakersListId();
    }, 8000);
    return () => clearInterval(APIinterval);
  }, []);

  useEffect(() => {
    getSpeakersListData();
    const APIinterval = setInterval(() => {
      getSpeakersListData();
    }, 1000);
    return () => clearInterval(APIinterval);
  }, [listId]);

  return (
    <SpeakersListDataContext.Provider value={speakersListData}>
      <SpeakersListIdContext.Provider value={listId}>
        <WidgetTemplate cardTitle={listTitle}>
          <Toast ref={toast} />
          {speakersListData?.speakers.length !== 0 ? (
            <>
              <SpeakerBlock />
            </>
          ) : (
            <div className="flex flex-col gap-2 items-start justify-center mt-3">
              <NoDataPlaceholder
                title={LL.participants.speakersList.NO_SPEAKERS_MESSAGE()}
              />
            </div>
          )}
          {children}
          <SpeakerQueueList myCountry={myCountry} chairOptions={chairOptions} />
        </WidgetTemplate>
      </SpeakersListIdContext.Provider>
    </SpeakersListDataContext.Provider>
  );
}
