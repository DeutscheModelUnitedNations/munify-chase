"use client";
import type React from "react";
import {
  CommitteeDataProvider,
  CommitteeIdContext,
} from "@/contexts/committee_data";
import { StatusTimerProvider } from "@/app/contexts/status_timer";

export default function Participant_Pages_Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { conferenceId: string; committeeId: string };
}) {
  return (
    <CommitteeIdContext.Provider value={params.committeeId}>
      <CommitteeDataProvider>
        <StatusTimerProvider>{children}</StatusTimerProvider>
      </CommitteeDataProvider>
    </CommitteeIdContext.Provider>
  );
}
