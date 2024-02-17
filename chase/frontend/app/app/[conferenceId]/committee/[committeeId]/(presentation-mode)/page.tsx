"use client";
import React, { useState, useEffect, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import PresenceWidget from "@/components/attendance/presence_widget";
import TimerWidget from "@/components/dashboard/timer";
import SpeakersListBlock from "@/components/speakers_list/speakers_list_block";
import WidgetTemplate from "@/components/widget_template";
import { toastError } from "@/fetching/fetching_utils";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { apiTestData } from "@/test_data";

type Committee = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["get"]>>["data"];
type DelegationData = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["delegations"]["get"]>>["data"];


export default function CommitteePresentationMode({
  params,
}: {
  params: { conferenceId: string; committeeId: string };
}) {
  const { LL, locale } = useI18nContext();

  const [committeeData, setCommitteeData] = useState<Committee | null>(null);
  const [delegationData, setDelegationData] = useState<DelegationData>([]);
  const [presentAttendees, setPresentAttendees] = useState<number>(0);
  const [excusedAttendees, setExcusedAttendees] = useState<number>(0);
  const [absentAttendees, setAbsentAttendees] = useState<number>(0);

  const toast = useRef(null);

  async function getCommitteeData() {
    await backend.conference[params.conferenceId].committee[params.committeeId]
      .get()
      .then((response) => {
        setCommitteeData(response.data);
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }


  async function getDelegationData() {
    await backend.conference[params.conferenceId].committee[params.committeeId].delegations
      .get()
      .then((response) => {
        setDelegationData(response.data);
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }

  useEffect(() => {
    getCommitteeData();
    getDelegationData();
    const intervalAPICall = setInterval(() => {
      getCommitteeData();
      getDelegationData();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);

  const countGroup = (group: "PRESENT" | "EXCUSED" | "ABSENT") => {
    return delegationData?.filter((item) => item.members[0].presence === group).length ?? 0;
  };

  useEffect(() => {
    setPresentAttendees(countGroup("PRESENT"));
    setExcusedAttendees(countGroup("EXCUSED"));
    setAbsentAttendees(countGroup("ABSENT"));
  }, [delegationData]);

  return (
    <div className="bg-primary-900 p-4 h-screen">
      <Toast ref={toast} />
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-2rem)]">
          <WidgetTemplate
            cardTitle={LL.participants.dashboard.widgetHeadlines.PRESENCE()}
          >
            <PresenceWidget
              presentAttendees={presentAttendees}
              excusedAttendees={excusedAttendees}
              absentAttendees={absentAttendees}
            />
          </WidgetTemplate>
          <TimerWidget
            category={committeeData?.status}
            headline={committeeData?.statusHeadline}
            until={committeeData?.statusUntil ? new Date(committeeData.statusUntil) : null}
          />
        </div>
        <div className="flex-1 flex justify-center h-[calc(100vh-2rem)]">
          <SpeakersListBlock
            listTitle={LL.participants.speakersList.SPEAKERS_LIST()}
            speakersData={apiTestData.speakersList}
          />
        </div>
        <div className="flex-1 flex justify-center h-[calc(100vh-2rem)]">
          <SpeakersListBlock
            listTitle={LL.participants.speakersList.COMMENT_LIST()}
            speakersData={apiTestData.commentList}
          />
        </div>
      </div>
    </div>
  );
}
