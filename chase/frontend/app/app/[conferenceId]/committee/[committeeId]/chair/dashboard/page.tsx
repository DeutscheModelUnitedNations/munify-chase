"use client";
import React, { useContext } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import DashboardHeader from "@/components/dashboard/header";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import TimerWidget from "@/components/dashboard/timer";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import PresenceWidget from "@/components/attendance/presence_widget";
import WidgetTemplate from "@/components/widget_template";
import {
  AgendaItemDataProvider,
  CommitteeDataContext,
  CommitteeDataProvider,
} from "@/contexts/committee_data";
import AgendaSelection from "@/components/dashboard/chair/agenda_selection";
import SetStatusWidget from "@/components/dashboard/chair/set_status";
import SpeakersListAddingPolicyWidget from "@/components/dashboard/chair/speakers_list_adding_policy";

export default function ParticipantDashboard() {
  const { LL } = useI18nContext();
  const committeeData = useContext(CommitteeDataContext);

  return (
    <>
      <CommitteeDataProvider>
        <AgendaItemDataProvider>
          <div className="flex-1 flex flex-col">
            <DashboardHeader
              countryCode="uno"
              alternativeHeadline={LL.chairs.CHAIR()}
            />
            {/* TODO Check why this Scroll Bar is not changing color as the other ones with the custom-scrollbar class */}
            <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 xl:grid-cols-2 m-4">
                <div className="flex flex-col gap-4">
                  <div className="w-full p-4 flex flex-col justify-stretch gap-4">
                    <h1 className="text-2xl font-bold">
                      {LL.chairs.dashboard.overview.TITLE()}
                    </h1>
                    <WidgetTemplate>
                      <PresenceWidget showExcusedSeperately={true} />
                    </WidgetTemplate>
                    <TimerWidget />
                    <WhiteboardWidget
                      value={committeeData?.whiteboardContent}
                    />
                  </div>
                </div>
                <div className="w-full p-4 flex flex-col justify-stretch gap-4">
                  <h1 className="text-2xl font-bold">
                    {LL.chairs.dashboard.configurations.TITLE()}
                  </h1>
                  <AgendaSelection />
                  <SetStatusWidget />
                  <SpeakersListAddingPolicyWidget />
                </div>
              </div>
            </ScrollPanel>
          </div>
        </AgendaItemDataProvider>
      </CommitteeDataProvider>
    </>
  );
}
