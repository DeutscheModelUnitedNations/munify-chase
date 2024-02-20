"use client";
import { MyDelegationProvider } from "@/contexts/user_ident";
import { ConferenceIdContext } from "@/contexts/committee_data";

export default function MyDelegationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { conferenceId: string };
}) {
  return (
    <ConferenceIdContext.Provider value={params.conferenceId}>
      <MyDelegationProvider>{children}</MyDelegationProvider>
    </ConferenceIdContext.Provider>
  );
}
