"use client";
import React, { useContext } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import CommitteeGrid from "@/components/navigation-hub/committee_grid";
import HeaderTemplate from "@/components/header_template";
import { LargeFlag } from "@/components/flag_templates";
import { ScrollPanel } from "primereact/scrollpanel";
import { conferenceRoleTranslation } from "@/i18n/translation_utils";
import { ConferenceIdContext } from "@/contexts/committee_data";
import { useUserIdent } from "@/contexts/user_ident";

export default function ChairHub({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);
  const { conferenceMembership } = useUserIdent();

  return (
    <>
      <div className="flex-1 flex flex-col">
        <HeaderTemplate>
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-2xl font-bold">{LL.hub.CHAIR_HUB_TITLE()}</h1>
            <h2 className="text-lg my-1">
              {conferenceRoleTranslation(
                LL,
                conferenceMembership(conferenceId)?.role,
              )}
            </h2>
          </div>
          <LargeFlag countryCode={"uno"} />
        </HeaderTemplate>
        <ScrollPanel style={{ width: "100%", height: "90vh" }} className="p-4">
          <CommitteeGrid conferenceId={params.conferenceId} isChair />
        </ScrollPanel>
      </div>
    </>
  );
}
