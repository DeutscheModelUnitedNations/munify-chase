"use client";
import React, { useState, useEffect } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { ToastProvider } from "@/contexts/messages/toast";

import DashboardHeader from "@/components/dashboard/header";
import SpeakersListWidget from "@/components/dashboard/speakers_list";
import TimerWidget from "@/components/dashboard/timer";
import CommitteeStatusWidget from "@/components/dashboard/committee_status";
import DocumentsWidget from "@/components/dashboard/documents";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import ActionsWidget from "@/components/dashboard/actions";
import { apiTestData } from "@/test_data";
import { useRouter } from "next/navigation";
import { useI18nContext } from "@/i18n/i18n-react";

export default function ParticipantDashboard() {
  const Router = useRouter();
  const { LL } = useI18nContext();
  const [data, setData] = useState(apiTestData);

  useEffect(() => {
    const intervalAPICall = setInterval(() => {
      console.log("API Call");
      setData(apiTestData);
    }, 1000);
    return () => clearInterval(intervalAPICall);
  }, []);

  return (
    <>
      <ToastProvider>
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            countryCode="uno"
            alternativeHeadline={LL.chairs.CHAIR()}
            committeeName={data.committeeName}
            currentTopic={data.currentTopic}
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
