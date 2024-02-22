import React, { useState, useEffect, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Link from "next/link";
import Timer from "../dashboard/countdown_timer";
import { toastError } from "@/fetching/fetching_utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faSpinner } from "@fortawesome/pro-solid-svg-icons";

type CommitteeArray = Awaited<
  ReturnType<(typeof backend.conference)[":conferenceId"]["committee"]["get"]>
>["data"];
type CommitteeType = NonNullable<CommitteeArray>[number];

export default function CommitteeGrid({
  conferenceId,
  isChair,
}: {
  conferenceId: string;
  isChair?: boolean;
}) {
  const { LL, locale } = useI18nContext();

  const [committees, setCommittees] = useState<CommitteeArray>(null);

  async function getCommittees() {
    await backend.conference[conferenceId].committee
      .get()
      .then((res) => {
        if (res.status !== 200) throw new Error(res.statusText);
        setCommittees(res.data);
      })
      .catch((err) => {
        toastError(toast);
      });
  }

  useEffect(() => {
    getCommittees();
    setInterval(() => {
      getCommittees();
    }, 10000);
  }, []);

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4">
      {committees?.map((committee) => {
        return (
          <CommitteeCard
            key={committee.id}
            conferenceId={conferenceId}
            committee={committee}
            isChair={isChair}
          />
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

function CommitteeCard({
  conferenceId,
  committee,
  isChair,
}: {
  conferenceId: string;
  committee: CommitteeType;
  isChair?: boolean;
}) {
  const { LL, locale } = useI18nContext();

  const [loading, setLoading] = useState(false);

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
  }

  return (
    <Link
      key={committee.id}
      href={`/app/${conferenceId}/committee/${committee.id}/${
        isChair ? "chair" : "participant"
      }/dashboard`}
      onClick={() => {
        setLoading(true);
      }}
      className="flex-1 h-60 min-w-60 flex flex-col justify-center items-center p-4 bg-primary-950 rounded-lg hover:bg-primary-900 hover:scale-[102%] hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
    >
      <div className="flex-1 flex flex-col justify-center items-center">
        <h3 className="text-lg">{committee.name}</h3>
        <h3 className="italic text-sm">
          {committee.agendaItems.find((i) => i.isActive)?.title ?? (
            <Skeleton
              width="5rem"
              height="1.25rem"
              className="!bg-primary-900"
            />
          )}
        </h3>
      </div>
      <h1 className="flex-1 text-4xl my-2 text-primary font-bold">
        {loading ? (
          <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
        ) : (
          committee.abbreviation
        )}
      </h1>
      <div className="flex-1 flex flex-col justify-center items-center w-full p-1 rounded-md bg-primary-900">
        <h3 className="text-lg">
          {getHeadline(committee.status, committee?.statusHeadline)}
        </h3>
        <div className="text-sm">
          {committee.statusUntil ? (
            <>
              {LL.participants.dashboard.timerWidget.UNTIL(
                new Date(committee.statusUntil).toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              )}
              {" ("}
              <Timer />
              {")"}
            </>
          ) : (
            <>
              <Skeleton
                width="10rem"
                height="1.50rem"
                className="!bg-primary-900"
              />
              <div className="h-1" />
              <Skeleton
                width="10rem"
                height="1.25rem"
                className="!bg-primary-900"
              />
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
