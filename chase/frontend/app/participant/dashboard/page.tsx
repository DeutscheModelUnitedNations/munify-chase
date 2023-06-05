"use client";
import React from "react";
import Navbar from "@/components/navbar/navbar";
import Image from "next/image";
import { ScrollPanel } from "primereact/scrollpanel";

import DashboardHeader from "@/components/dashboard/header";
import SpeakersListWidget from "@/components/dashboard/speakerslist";
import TimerWidget from "@/components/dashboard/timer";
import CommitteeStatusWidget from "@/components/dashboard/committeestatus";
import DocumentsWidget from "@/components/dashboard/documents";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import ActionsWidget from "@/components/dashboard/actions";

export default function participant_dashboard() {
  const [countryName, setCountryName] = React.useState("Republik Panama");
  const [countryCode, setCountryCode] = React.useState("jam");
  const [committeeName, setCommitteeName] =
    React.useState("Generalversammlung");
  const [currentTopic, setCurrentTopic] = React.useState(
    "Rechte von Kindersoldaten",
  );

  // Demo data
  const pauseHeadline = "Informelle Sitzung";
  const pauseUntil = new Date(Date.now() + 1000 * 10);
  const pauseCategory = "informal";

  return (
    <>
      <Navbar active={{ index: 0, path: "/participant/dashboard" }} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          countryName={countryName}
          countryCode={countryCode}
          committeeName={committeeName}
          currentTopic={currentTopic}
        />
        <ScrollPanel className="flex-1 overflow-y-auto">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2  gap-5 p-4">
            <div className="flex-1 flex flex-col justify-start items-stretch gap-5">
              <SpeakersListWidget />
              <TimerWidget
                headline={pauseHeadline}
                until={pauseUntil}
                category={pauseCategory}
              />
            </div>
            <div className="flex-1 flex flex-col justify-start items-stretch gap-5">
              <CommitteeStatusWidget />
              <DocumentsWidget />
            </div>
            <div className="flex-1 flex flex-col justify-start items-stretch gap-5 md:col-span-2 lg:col-span-1">
              <WhiteboardWidget />
              <ActionsWidget />
            </div>
          </div>
        </ScrollPanel>
      </div>
    </>
  );
}
