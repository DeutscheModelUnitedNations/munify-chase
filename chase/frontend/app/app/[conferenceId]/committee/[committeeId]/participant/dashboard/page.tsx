"use client";
import React, { useState, useEffect, useRef } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { ToastProvider } from "@/contexts/toast";

import DashboardHeader from "@/components/dashboard/header";
import SpeakersListWidget from "@/components/dashboard/speakers_list";
import TimerWidget from "@/components/dashboard/timer";
import CommitteeStatusWidget from "@/components/dashboard/committee_status";
import DocumentsWidget from "@/components/dashboard/documents";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import ActionsWidget from "@/components/dashboard/actions";
import { apiTestData } from "@/test_data";
import { votingAlert } from "@/misc/voting_alert";
import { useRouter } from "next/navigation";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { toastError } from "@/fetching/fetching_utils";

type Committee = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["get"]>>["data"];
type AgendaItem = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["agendaItem"]["active"]["get"]>>["data"];
type MyDelegation = Awaited<ReturnType<typeof backend.conference["conferenceId"]["user"]["userId"]["delegation"]["get"]>>["data"];

export default function participant_dashboard({
  params
}: {
  params: { conferenceId: string; committeeId: string }
}) {
  const Router = useRouter();
  const { LL } = useI18nContext();
  const [data, setData] = useState(apiTestData);
  const [committeeData, setCommitteeData] = useState<Committee | null>(null);
  const [agendaItem, setAgendaItem] = useState<AgendaItem | null>(null);
  const [myDelegationData, setMyDelegationData] = useState<MyDelegation | null>(null);
  const toast = useRef<Toast>(null);

  const USER_ID_HARDCODED = "d9e113de-eafa-4a14-bc58-365cc56a4999"; // TODO replace with actual user id logic

  async function getMyDelegationData() {
    await backend.conference[params.conferenceId].user[USER_ID_HARDCODED].delegation
      .get()
      .then((response) => {
        setMyDelegationData(response.data);
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }

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

  async function getAgendaItem() {
    await backend.conference[params.conferenceId].committee[params.committeeId].agendaItem.active
      .get()
      .then((response) => {
        if (response.error?.status === 404) {
          setAgendaItem(null);
          return;
        }
        setAgendaItem(response.data);
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }


  useEffect(() => {
    getCommitteeData();
    getAgendaItem();
    getMyDelegationData();
    setData(apiTestData);

    const intervalAPICall = setInterval(() => {
      getCommitteeData();
      getAgendaItem();
      setData(apiTestData);
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);

  return (
    <ToastProvider>
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          countryCode={myDelegationData?.nation?.alpha3Code}
          committeeName={committeeData?.name}
          currentTopic={agendaItem?.title}
        />
        {/* TODO Check why this Scroll Bar is not changing color as the other ones with the custom-scrollbar class */}
        <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-5 p-4">
            <div className="flex-1 flex flex-col justify-start items-stretch gap-5">
              <SpeakersListWidget
                myCountry={data.myCountry}
                speakersList={data.speakersList}
                commentList={data.commentList}
              />
              <TimerWidget
                headline={committeeData?.statusHeadline}
                until={committeeData?.statusUntil ? new Date(committeeData.statusUntil) : null}
                category={committeeData?.status}
              />
            </div>
            {/* <div className="flex-1 flex flex-col justify-start items-stretch gap-5">
                <CommitteeStatusWidget
                  currentDebateStep={data.committeeStatus.currentDebateStep}
                  nextDebateStep={data.committeeStatus.nextDebateStep}
                />
                <DocumentsWidget documents={data.documents} />
              </div> */}
            <div className="flex-1 flex flex-col justify-start items-stretch gap-5 md:col-span-2 lg:col-span-1">
              <WhiteboardWidget value={committeeData?.whiteboardContent} />
              <ActionsWidget />
            </div>
          </div>
        </ScrollPanel>
      </div>
    </ToastProvider>
  );
}
