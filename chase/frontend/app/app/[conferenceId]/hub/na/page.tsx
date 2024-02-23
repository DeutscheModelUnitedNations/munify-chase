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
      <div className="flex justify-center items-start min-h-screen bg-primary">
        <div className="flex-1 flex flex-col justify-center items-center m-10 mt-20">
          <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-primary-200 w-11/12 p-5 rounded-md shadow-lg">
            <h1 className="text-3xl">{LL.hub.NA_HUB_TITLE()}</h1>
            <h2 className="text-xl mt-2 mb-8">{LL.hub.SELECT_COMMITTEE()}</h2>
            <CommitteeGrid conferenceId={params.conferenceId} />
            <Button
              className="mt-8"
              faIcon={faArrowRightFromBracket}
              label={
                LL.hub.LOGOUT()
                // TODO @Felix onClick={logout}
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
