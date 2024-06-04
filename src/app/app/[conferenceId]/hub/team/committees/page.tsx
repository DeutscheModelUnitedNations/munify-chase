"use client";
import { useContext } from "react";
import { useI18nContext } from "@/app/i18n/i18n-react";
import CommitteeGrid from "@/app/components/navigation-hub/committee_grid";
import HeaderTemplate from "@/app/components/header_template";
import { LargeFlag } from "@/app/components/flag_templates";
import { ScrollPanel } from "primereact/scrollpanel";
import { conferenceRoleTranslation } from "@/app/i18n/translation_utils";
import { useBackendTime } from "@/app/contexts/backendTime";
import FAIcon from "@/app/components/font_awesome_icon";

export default function ChairHub({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL, locale } = useI18nContext();
  const { currentTime } = useBackendTime();

  return (
    <>
      <div className="flex-1 flex flex-col">
        <HeaderTemplate>
          <FAIcon
            icon="rocket-launch"
            className="text-4xl ml-6 mr-8 text-primary"
          />
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-2xl font-bold">{LL.hub.CHAIR_HUB_TITLE()}</h1>
            <h2 className="text-lg my-1">
              {conferenceRoleTranslation(
                LL,
                //@ts-ignore
                conferenceMembership(conferenceId)?.role,
              )}
            </h2>
          </div>
          <div className="flex-1" />
          <div className="font-mono text-5xl text-primary-300 dark:text-primary-700 mr-10">
            {currentTime.toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "numeric",
              second: "numeric",
            })}
          </div>
          <LargeFlag countryCode={"uno"} />
        </HeaderTemplate>
        <ScrollPanel style={{ width: "100%", height: "90vh" }}>
          <CommitteeGrid conferenceId={params.conferenceId} isChair />
        </ScrollPanel>
      </div>
    </>
  );
}