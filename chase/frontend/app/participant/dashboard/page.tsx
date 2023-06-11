"use client";
import React from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { ToastProvider } from "@/components/messages/toast";

import DashboardHeader from "@/components/dashboard/header";
import SpeakersListWidget from "@/components/dashboard/speakers_list";
import TimerWidget from "@/components/dashboard/timer";
import CommitteeStatusWidget from "@/components/dashboard/committee_status";
import DocumentsWidget from "@/components/dashboard/documents";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import ActionsWidget from "@/components/dashboard/actions";
import { CountryCode } from "@/custom_types";

export default function participant_dashboard() {
  const [countryCode, setCountryCode] = React.useState<CountryCode>("jam");
  const [committeeName, setCommitteeName] =
    React.useState("Generalversammlung");
  const [currentTopic, setCurrentTopic] = React.useState(
    "Rechte von Kindersoldaten",
  );

  // Demo data
  const pauseHeadline = "Informelle Sitzung";
  const pauseUntil = new Date(Date.now() + 1000 * 10);
  const pauseCategory = "informal";

  const markdown_content =
    "# Hello World!\n\nHier ist ein Markdown-Beispiel.\n\n## Vorsitzende\n* Miriam Güthe\n* Maximilian Ilzhöfer\n* Tade Strehk\n## Gremienberatung\n* Felix Thomsen\n\nUnd hier ein [Link](https://www.google.com).\n\n> **An alle Terrorteilis:** Das Pöbeln nicht vergessen!\n\n# Über diesen Block\n\nHier können die Vorsitzenden aktuelle Informationen anzeigen. Das ganze wird über einen Editor funktionieren, sodass die Vorsitzenden über Markdown ihre Informationen individuell verpacken und anzeigen können. Das bietet größtmögliche Flexibilität und Übersichtlichkeit.";

  return (
    <>
      <ToastProvider>
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            countryCode={countryCode}
            committeeName={committeeName}
            currentTopic={currentTopic}
          />
          {/* TODO Check why this Scroll Bar is not changing color as the other ones with the custom-scrollbar class */}
          <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5 p-4">
              <div className="flex-1 flex flex-col justify-start items-stretch gap-5">
                <SpeakersListWidget myCountry={countryCode} />
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
                <WhiteboardWidget markdown_content={markdown_content} />
                <ActionsWidget />
              </div>
            </div>
          </ScrollPanel>
        </div>
      </ToastProvider>
    </>
  );
}
