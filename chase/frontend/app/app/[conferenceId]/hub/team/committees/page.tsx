"use client";
import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import CommitteeGrid from "@/components/navigation-hub/committee_grid";
import Button from "@/components/button";
import { faArrowRightFromBracket } from "@fortawesome/pro-solid-svg-icons";
import HeaderTemplate from "@/components/header_template";
import DashboardHeader from "@/components/dashboard/header";
import { LargeFlag } from "@/components/flag_templates";
import { ScrollPanel } from "primereact/scrollpanel";

export default function ChairHub({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL, locale } = useI18nContext();

  return (
    <>
      <div className="flex-1 flex flex-col">
        <HeaderTemplate>
          <div className="flex flex-col items-start justify-center">
            <div className="text-2xl font-bold mb-1">
              <div className="text-md font-bold my-1">
                {LL.hub.CHAIR_HUB_TITLE()}
              </div>
            </div>
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
