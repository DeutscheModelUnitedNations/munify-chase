"use client";
import React, { useContext } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import DashboardHeader from "@/components/dashboard/header";
import { useI18nContext } from "@/i18n/i18n-react";
import TimerWidget from "@/components/dashboard/timer";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import PresenceWidget from "@/components/attendance/presence_widget";
import WidgetTemplate from "@/components/widget_template";
import {
  AgendaItemDataProvider,
  ConferenceIdContext,
  CommitteeIdContext,
} from "@/contexts/committee_data";
import AgendaSelection from "@/components/dashboard/chair/agenda_selection";
import SetStatusWidget from "@/components/dashboard/chair/set_status";
import SpeakersListAddingPolicyWidget from "@/components/dashboard/chair/speakers_list_adding_policy";
import Button from "@/components/button";
import {
  faPodium,
  faPresentationScreen,
} from "@fortawesome/pro-solid-svg-icons";
import ConfigWrapper from "@/components/dashboard/chair/config_wrapper";
import StateOfDebateWidget from "@/components/dashboard/chair/state_of_debate";
import { useSpeakersListMiniature } from "@/contexts/speakers_list_miniature";

export default function ChairDashboardPage() {
  const { LL } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const { toggleSpeakersListMiniature } = useSpeakersListMiniature();

  return (
    <>
      <AgendaItemDataProvider>
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
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
                  <WhiteboardWidget />
                </div>
              </div>
              <div className="w-full p-4 flex flex-col justify-stretch gap-4">
                <h1 className="text-2xl font-bold">
                  {LL.chairs.dashboard.configurations.TITLE()}
                </h1>
                <SetStatusWidget />
                <StateOfDebateWidget />
                <AgendaSelection />
                <SpeakersListAddingPolicyWidget />
                <ConfigWrapper
                  title="Speakers List Overlay"
                  description="This feature allows you to see the speakers list in a separate overlay an all other Pages in the App"
                >
                  <Button
                    faIcon={faPodium}
                    label="Open Speakers List Overlay"
                    keyboardShortcut="O"
                    onClick={() => toggleSpeakersListMiniature()}
                    className="w-full"
                  />
                </ConfigWrapper>
                <ConfigWrapper
                  title={LL.chairs.dashboard.configurations.presentationMode.TITLE()}
                  description={LL.chairs.dashboard.configurations.presentationMode.DESCRIPTION()}
                >
                  <Button
                    faIcon={faPresentationScreen}
                    label={LL.chairs.dashboard.configurations.presentationMode.BUTTON()}
                    onClick={() => {
                      window.open(
                        `/app/${conferenceId}/committee/${committeeId}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }}
                    className="w-full"
                  />
                </ConfigWrapper>
              </div>
            </div>
          </ScrollPanel>
        </div>
      </AgendaItemDataProvider>
    </>
  );
}
