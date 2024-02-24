import React, { useState, useEffect, useRef, Children } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import Link from "next/link";
import Timer from "../dashboard/countdown_timer";
import { toastError } from "@/fetching/fetching_utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faDiagramSubtask,
  faPodium,
  faComments,
  faMugHot,
  faForwardStep,
  faQuestion,
} from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import SmallInfoCard from "../small_info_card";
import {
  CommitteeDataProvider,
  CommitteeIdContext,
} from "@/contexts/committee_data";
import { StatusTimerProvider } from "@/contexts/status_timer";

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
    <div className="w-full flex flex-wrap justify-start items-center gap-4 p-10">
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
            className="flex-1 min-w-[30rem] !bg-primary-900 rounded-lg"
          />
          <Skeleton
            height="15rem"
            className="flex-1 min-w-[30rem] !bg-primary-900 rounded-lg"
          />
          <Skeleton
            height="15rem"
            className="flex-1 min-w-[30rem] !bg-primary-900 rounded-lg"
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

  const getIcon: (category: CommitteeType["status"]) => IconProp = (
    category,
  ) => {
    switch (category) {
      case "FORMAL":
        return faPodium as IconProp;
      case "INFORMAL":
        return faComments as IconProp;
      case "PAUSE":
        return faMugHot as IconProp;
      case "SUSPENSION":
        return faForwardStep as IconProp;
      default:
        return faQuestion as IconProp;
    }
  };

  const getColor: (category: CommitteeType["status"]) => string | undefined = (
    category,
  ) => {
    switch (category) {
      case "FORMAL":
        return undefined;
      case "INFORMAL":
        return "bg-red-500 dark:bg-red-800 text-white dark:text-primary-950";
      case "PAUSE":
        return "bg-secondary dark:bg-secondary-300 text-white dark:text-secondary-100";
      case "SUSPENSION":
        return "bg-primary-300 dark:bg-primary-700 text-white dark:text-primary-200";
      default:
        return undefined;
    }
  };

  return (
    <CommitteeIdContext.Provider value={committee.id}>
      <CommitteeDataProvider>
        <StatusTimerProvider>
          <Link
            key={committee.id}
            href={`/app/${conferenceId}/committee/${committee.id}/${
              isChair ? "chair" : "participant"
            }/dashboard`}
            onClick={() => {
              setLoading(true);
            }}
            className="flex-1 min-w-[30rem] flex flex-col justify-between p-4 gap-2 bg-primary-950 rounded-lg hover:scale-[102%] hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
          >
            <h3 className="text-lg">{committee.name}</h3>
            <h1 className="flex-1 mt-4 mb-6 ml-4 text-4xl text-primary font-bold">
              {loading ? (
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
              ) : (
                committee.abbreviation
              )}
            </h1>

            <SmallInfoCard icon={faPodium}>
              {committee.agendaItems.find((i) => i.isActive)?.title ? (
                <h3 className="text-lg">
                  {committee.agendaItems.find((i) => i.isActive)?.title}
                </h3>
              ) : (
                <Skeleton
                  width={`${Math.random() * (100 - 20) + 20}%`}
                  height="1.75rem"
                  className="!bg-primary-800"
                />
              )}
            </SmallInfoCard>

            <SmallInfoCard icon={faDiagramSubtask}>
              {committee?.stateOfDebate != null &&
              committee?.stateOfDebate !== "" ? (
                <h3 className="text-lg truncate">{committee?.stateOfDebate}</h3>
              ) : (
                <Skeleton
                  width={`${Math.random() * (100 - 20) + 20}%`}
                  height="1.75rem"
                  className="!bg-primary-800"
                />
              )}
            </SmallInfoCard>

            <SmallInfoCard
              icon={getIcon(committee?.status)}
              color={getColor(committee?.status)}
            >
              {committee.statusUntil ? (
                <h3 className="text-lg">
                  {getHeadline(committee.status, committee?.statusHeadline)}{" "}
                  <span className="italic">
                    {LL.participants.dashboard.timerWidget.UNTIL(
                      new Date(committee.statusUntil).toLocaleTimeString(
                        "de-DE",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      ),
                    )}
                    {" ("}
                    <Timer />
                    {")"}
                  </span>
                </h3>
              ) : (
                <Skeleton
                  width={`${Math.random() * (100 - 20) + 20}%`}
                  height="1.75rem"
                  className="!bg-primary-800"
                />
              )}
            </SmallInfoCard>
          </Link>
        </StatusTimerProvider>
      </CommitteeDataProvider>
    </CommitteeIdContext.Provider>
  );
}
