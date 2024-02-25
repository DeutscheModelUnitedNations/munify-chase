"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { backend } from "@/services/backend";
import { ConferenceIdContext, CommitteeIdContext } from "./committee_data";
import { toastError } from "@/fetching/fetching_utils";
import { $Enums } from "../../backend/prisma/generated/client";

export type SpeakersListDataType = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["committee"]["committeeId"]["speakersList"]["type"]["get"]
  >
>["data"];

export const SpeakersListDataContext =
  createContext<SpeakersListDataType | null>(null);

export function SpeakersListDataProvider({
  children,
  typeOfList,
}: {
  children: React.ReactNode;
  typeOfList: $Enums.SpeakersListCategory;
}) {
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const [speakersListData, setSpeakersListData] =
    useState<SpeakersListDataType | null>(null);

  async function getSpeakersListData() {
    if (!conferenceId || !committeeId) return;
    await backend.conference[conferenceId].committee[committeeId].speakersList[
      typeOfList
    ]
      .get()
      .then((response) => {
        if (response.status !== 200)
          throw new Error("Error fetching speakers list data");
        setSpeakersListData(response.data);
      })
      .catch((error) => {
        toastError(error);
        console.error(error);
      });
  }

  useEffect(() => {
    getSpeakersListData();
    const APIinterval = setInterval(() => {
      getSpeakersListData();
    }, 1000);
    return () => clearInterval(APIinterval);
  }, [conferenceId, committeeId, typeOfList]);

  return (
    <SpeakersListDataContext.Provider value={speakersListData}>
      {children}
    </SpeakersListDataContext.Provider>
  );
}
