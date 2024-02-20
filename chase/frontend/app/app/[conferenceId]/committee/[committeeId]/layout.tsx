"use client";
import React from "react";
import {
  ConferenceIdContext,
  CommitteeIdContext,
} from "@/contexts/committee_data";

export default function Participant_Pages_Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { conferenceId: string; committeeId: string };
}) {
  return (
    <ConferenceIdContext.Provider value={params.conferenceId}>
      <CommitteeIdContext.Provider value={params.committeeId}>
        {children}
      </CommitteeIdContext.Provider>
    </ConferenceIdContext.Provider>
  );
}
