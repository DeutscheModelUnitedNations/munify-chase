import React, { useState, useEffect, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { Committee, CommitteeStatus } from "../../../backend/prisma/generated/client";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Link from "next/link";

export default function CommitteeGrid({
  conferenceId,
  isChair,
}: {
  conferenceId: string;
  isChair?: boolean;
}) {
  const { LL, locale } = useI18nContext();
  const toast = useRef<Toast>(null);

  const [committees, setCommittees] = useState<Committee[] | null>(null);

  async function getCommittees() {
    
    await backend.conference[conferenceId].committee
      .get()
      .then((res) => {
        console.log(res.data);
        setCommittees(res.data);
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  }

  useEffect(() => {
    getCommittees();
    setInterval(() => {
      getCommittees();
    }, 10000);
  }, []);

  function getHeadline(category: CommitteeStatus, headline: string | undefined | null) {
    if (headline) return headline;
    switch (category) {
      case "FORMAL":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.FORMAL();
      case "INFORMAL":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.INFORMAL();
      case "PAUSE":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.PAUSE();
      case "SUSPENSION":
        return LL.participants.dashboard.timerWidget.defaultHeadlines.SUSPENSION();
      default:
        return "";
    }
  };

  function getActiveAgendaItem(committee: Committee) {}

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4">
      {committees?.map((committee) => {
        return (
          <Link
            key={committee.id}
            href={`/app/${conferenceId}/committee/${committee.id}/${
              isChair ? "chair" : "participant"
            }/dashboard`}
            className="flex-1 h-48 min-w-60 flex flex-col justify-center items-center p-4 bg-primary-950 rounded-lg hover:bg-primary-900 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
          >
            <h1 className="text-4xl my-4 text-primary font-bold">
              {committee.abbreviation}
            </h1>
            <h3 className="text-lg">{committee.name}</h3>
            <div className="w-full flex flex-col items-center justify-center">
              <div className="" />
              {getHeadline(committee.status, committee?.statusHeadline)}
            </div>
            <div className="">
              {committee.statusUntil &&
                LL.participants.dashboard.timerWidget.UNTIL(
                  new Date(committee.statusUntil).toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                )}
            </div>
          </Link>
        );
      })}
      {committees?.length === 0 && (
        <h1 className="text-2xl">{LL.hub.NO_COMMITTEES()}</h1>
      )}
      {!committees && (
        <>
          <Skeleton
            height="12rem"
            className="flex-1 min-w-60 bg-slate-100 rounded-lg"
          />
          <Skeleton
            height="12rem"
            className="flex-1 min-w-60 bg-slate-100 rounded-lg"
          />
          <Skeleton
            height="12rem"
            className="flex-1 min-w-60 bg-slate-100 rounded-lg"
          />
        </>
      )}
    </div>
  );
}
