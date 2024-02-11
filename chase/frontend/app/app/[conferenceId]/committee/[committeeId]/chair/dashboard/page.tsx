"use client";
import React, { useState, useEffect, useRef } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { ToastProvider } from "@/contexts/toast";

import DashboardHeader from "@/components/dashboard/header";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { tostError } from "@/fetching/fetching_utils";
import { Toast } from "primereact/toast";

type Committee = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["get"]>>["data"];
type AgendaItem = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["agendaItem"]["active"]["get"]>>["data"];

export default function ParticipantDashboard(
  {
    params
  }:{
    params: { conferenceId: string; committeeId: string}
  }
) {
  const { LL } = useI18nContext();
  const [committeeData, setCommitteeData] = useState<Committee | null>(null);
  const [agendaItem, setAgendaItem] = useState<AgendaItem | null>(null);
  const toast = useRef<Toast>(null);

  async function getCommitteeData() {
    await backend.conference[params.conferenceId].committee[params.committeeId]
    .get()
    .then((response) => {
      setCommitteeData(response.data);
    })
    .catch((error) => {
      tostError(toast, LL, error);
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
      tostError(toast, LL, error);
    });
  }

  useEffect(() => {
    getCommitteeData();
    getAgendaItem();
    const intervalAPICall = setInterval(() => {
      getCommitteeData();
      getAgendaItem();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);

  return (
    <>
      <ToastProvider>
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            countryCode="uno"
            alternativeHeadline={LL.chairs.CHAIR()}
            committeeName={committeeData?.name}
            currentTopic={agendaItem?.title}
          />
          {/* TODO Check why this Scroll Bar is not changing color as the other ones with the custom-scrollbar class */}
          <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
            {/* <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5 p-4">
                            <div className="flex-1 flex flex-col justify-start items-stretch gap-5">
                                <SpeakersListWidget
                                    myCountry={data.myCountry}
                                    speakersList={data.speakersList}
                                    commentList={data.commentList}
                                />
                                <TimerWidget
                                    headline={data.committeeStatus.status}
                                    until={data.committeeStatus.until}
                                    category={data.committeeStatus.category}
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-start items-stretch gap-5">
                                <CommitteeStatusWidget
                                    currentDebateStep={data.committeeStatus.currentDebateStep}
                                    nextDebateStep={data.committeeStatus.nextDebateStep}
                                />
                                <DocumentsWidget documents={data.documents} />
                            </div>
                            <div className="flex-1 flex flex-col justify-start items-stretch gap-5 md:col-span-2 lg:col-span-1">
                                <WhiteboardWidget markdown_content={data.whiteboardMarkdown} />
                                <ActionsWidget />
                            </div>
                        </div> */}
          </ScrollPanel>
        </div>
      </ToastProvider>
    </>
  );
}
