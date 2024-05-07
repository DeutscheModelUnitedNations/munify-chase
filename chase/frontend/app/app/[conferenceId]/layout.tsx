"use client";
import { ConferenceIdContext } from "@/contexts/committee_data";
import {
  DisconnectWarning,
  DisconnectWarningProvider,
} from "@/contexts/disconnectWarning";
import { useState } from "react";

export default function MyDelegationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { conferenceId: string };
}) {
  const [disconnectWarning, setDisconnectWarning] = useState(false);

  return (
    <ConferenceIdContext.Provider value={params.conferenceId}>
      <DisconnectWarningProvider>{children}</DisconnectWarningProvider>
    </ConferenceIdContext.Provider>
  );
}
