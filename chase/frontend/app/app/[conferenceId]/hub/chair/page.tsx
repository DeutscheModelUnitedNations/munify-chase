"use client";
import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import CommitteeGrid from "@/components/navigation-hub/committee_grid";
import Button from "@/components/button";
import { faArrowRightFromBracket } from "@fortawesome/pro-solid-svg-icons";

export default function ChairHub({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL, locale } = useI18nContext();

  return (
    <>
      <h1 className="text-3xl">{LL.hub.CHAIR_HUB_TITLE()}</h1>
      <h2 className="text-xl mt-2 mb-8">{LL.hub.SELECT_COMMITTEE()}</h2>
      <CommitteeGrid conferenceId={params.conferenceId} isChair />
      <Button
        className="mt-8"
        faIcon={faArrowRightFromBracket}
        label={
          LL.hub.LOGOUT()
          // TODO @Felix onClick={logout}
        }
      />
    </>
  );
}
