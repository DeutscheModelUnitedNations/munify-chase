import React, { useState, useEffect, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Link from "next/link";
import Timer from "../dashboard/countdown_timer";

type CommitteeArray = Awaited<ReturnType<typeof backend.conference[":conferenceId"]["committee"]["get"]>>["data"];
type CommitteeType = NonNullable<CommitteeArray>[number];

export default function CommitteeGrid({
  conferenceId,
  isChair,
}: {
  conferenceId: string;
  isChair?: boolean;
}) {
  const { LL, locale } = useI18nContext();
  const toast = useRef<Toast>(null);

  const [committees, setCommittees] = useState<CommitteeArray>(null);

  async function getCommittees() {

    await backend.conference[conferenceId].committee
      .get()
      .then((res) => {
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

  function getHeadline(category: CommitteeType["status"], headline?: string) {
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

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4">
      {committees && committees?.map((committee) => {
        return (
          <Link
            key={committee.id}
            href={`/app/${conferenceId}/committee/${committee.id}/${isChair ? "chair" : "participant"
              }/dashboard`}
            className="flex-1 h-60 min-w-60 flex flex-col justify-center items-center p-4 bg-primary-950 rounded-lg hover:bg-primary-900 hover:scale-[102%] hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
          >
            <div className="flex-1 flex flex-col justify-center items-center">
              <h3 className="text-lg">{committee.name}</h3>
              <h3 className="italic text-sm">{committee.agendaItems.find((i) => i.isActive)?.title ?? ""}</h3>
            </div>
            <h1 className="flex-1 text-4xl my-2 text-primary font-bold">
              {committee.abbreviation}
            </h1>
            <div className="flex-1 flex flex-col justify-center items-center w-full p-1 rounded-xl border-2 border-white">
              <h3>{getHeadline(committee.status, committee?.statusHeadline)}</h3>
              <div className="">
                {committee.statusUntil && (<>
                  {LL.participants.dashboard.timerWidget.UNTIL(
                    new Date(committee.statusUntil).toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  )}
                  {" ("}<Timer until={new Date(committee.statusUntil)} />{")"}
                </>)}
              </div>
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
            height="15rem"
            className="flex-1 min-w-60 bg-slate-100 rounded-lg"
          />
          <Skeleton
            height="15rem"
            className="flex-1 min-w-60 bg-slate-100 rounded-lg"
          />
          <Skeleton
            height="15rem"
            className="flex-1 min-w-60 bg-slate-100 rounded-lg"
          />
        </>
      )}
    </div>
  );
}
