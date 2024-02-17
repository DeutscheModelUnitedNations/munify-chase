"use client";
import React, { useState, useEffect, useRef } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { ToastProvider } from "@/contexts/toast";

import DashboardHeader from "@/components/dashboard/header";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { toastError } from "@/fetching/fetching_utils";
import { Toast } from "primereact/toast";
import ConfigWrapper from "@/components/dashboard/admin/config_wrapper";
import { Dropdown } from "primereact/dropdown";
import Button from "@/components/button";
import { faComment, faFloppyDisk, faForwardStep, faMugHot, faPencil, faPodium } from "@fortawesome/pro-solid-svg-icons";
import { $Enums } from "../../../../../../../../backend/prisma/generated/client";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SpeakersListWidget from "@/components/dashboard/speakers_list";
import TimerWidget from "@/components/dashboard/timer";

type Committee = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["get"]>>["data"];
type AgendaItems = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["agendaItem"]["get"]>>["data"];

export default function ParticipantDashboard(
  {
    params
  }: {
    params: { conferenceId: string; committeeId: string }
  }
) {
  const { LL } = useI18nContext();
  const [committeeData, setCommitteeData] = useState<Committee | null>(null);
  const [agendaItem, setAgendaItem] = useState<AgendaItems | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<$Enums.CommitteeStatus | null>(null);
  const [selectedStatusUntil, setSelectedStatusUntil] = useState<Date | null>(null);
  const [selectedStatusCustomText, setSelectedStatusCustomText] = useState<string | null>("");
  const toast = useRef<Toast>(null);

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

  async function getAgendaItems() {
    await backend.conference[params.conferenceId].committee[params.committeeId].agendaItem
      .get()
      .then((response) => {
        setAgendaItem(response.data);
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }

  useEffect(() => {
    getCommitteeData();
    getAgendaItems();
    const intervalAPICall = setInterval(() => {
      getCommitteeData();
      getAgendaItems();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);


  async function activateAgendaItem(agendaItemId: string) {
    setAgendaItem(null);
    await backend.conference[params.conferenceId].committee[params.committeeId].agendaItem[agendaItemId].activate
      .post()
      .then(() => {
        getAgendaItems();
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }

  async function updateStatus() {
    await backend.conference[params.conferenceId].committee[params.committeeId].status
      .post({
        status: selectedStatus ?? undefined,
        statusUntil: selectedStatusUntil?.toISOString() ?? undefined,
        statusHeadline: selectedStatusCustomText ?? undefined,
      })
      .then(() => {
        getCommitteeData();
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }

  return (
    <>
      <ToastProvider>
        <div className="flex-1 flex flex-col">
          <DashboardHeader
            countryCode="uno"
            alternativeHeadline={LL.chairs.CHAIR()}
            committeeName={committeeData?.name}
            currentTopic={agendaItem?.find((item) => item.isActive)?.title}
          />
          {/* TODO Check why this Scroll Bar is not changing color as the other ones with the custom-scrollbar class */}
          <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 xl:grid-cols-2 m-4">
              <div className="flex flex-col gap-4">
                <div className="w-full p-4 flex flex-col justify-stretch gap-4">
                  <h1 className="text-2xl font-bold">
                    {LL.chairs.dashboard.overview.TITLE()}
                  </h1>
                  <TimerWidget
                    category={committeeData?.status}
                    headline={committeeData?.statusHeadline}
                    until={committeeData?.statusUntil ? new Date(committeeData.statusUntil) : null}
                  />
                </div>
              </div>
              <div className="w-full p-4 flex flex-col justify-stretch gap-4">
                <h1 className="text-2xl font-bold">
                  {LL.chairs.dashboard.configurations.TITLE()}
                </h1>
                <ConfigWrapper title={LL.chairs.dashboard.configurations.agenda.TITLE()} description={LL.chairs.dashboard.configurations.agenda.DESCRIPTION()}>
                  <div className="flex gap-2">
                    <Button
                      faIcon={faPencil}
                      onClick={() => {
                        // TODO Implement Chairs creating new Agenda Items
                        alert("Not implemented yet");
                      }}
                      disabled
                    />
                    <Dropdown
                      value={agendaItem?.find((item) => item.isActive)?.id || null}
                      options={agendaItem?.map((item) => ({ label: item.title, value: item.id }))}
                      onChange={(e) => activateAgendaItem(e.value)}
                      placeholder={LL.chairs.dashboard.configurations.agenda.PLACEHOLDER()}
                      loading={!agendaItem}
                    />
                  </div>
                </ConfigWrapper>

                <ConfigWrapper title={LL.chairs.dashboard.configurations.statusTimer.TITLE()} description={LL.chairs.dashboard.configurations.statusTimer.DESCRIPTION()}>
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-full flex gap-2">
                      <Dropdown
                        value={selectedStatus || committeeData?.status || null}
                        options={[
                          { label: LL.participants.dashboard.timerWidget.defaultHeadlines.FORMAL(), value: "FORMAL", icon: faPodium },
                          { label: LL.participants.dashboard.timerWidget.defaultHeadlines.INFORMAL(), value: "INFORMAL", icon: faComment },
                          { label: LL.participants.dashboard.timerWidget.defaultHeadlines.PAUSE(), value: "PAUSE", icon: faMugHot },
                          { label: LL.participants.dashboard.timerWidget.defaultHeadlines.SUSPENSION(), value: "SUSPENSION", icon: faForwardStep },
                        ]}
                        itemTemplate={(option) => <div className="flex flex-gap items-center"><FontAwesomeIcon icon={option.icon} className="w-8 mr-2" />{option.label}</div>}
                        onChange={(e) => {
                          setSelectedStatus(e.value);
                        }}
                        placeholder={LL.chairs.dashboard.configurations.statusTimer.PLACEHOLDER_DROPDOWN()}
                        className="flex-1"
                      />
                      <Calendar
                        timeOnly
                        value={selectedStatusUntil}
                        onChange={(e) => e.value && setSelectedStatusUntil(e.value)}
                        placeholder={LL.chairs.dashboard.configurations.statusTimer.PLACEHOLDER_TIME_UNITL()}
                        className="flex-1"
                      />
                    </div>
                    <InputText
                      value={selectedStatusCustomText ?? undefined}
                      onChange={(e) => setSelectedStatusCustomText(e.target.value)}
                      placeholder={LL.chairs.dashboard.configurations.statusTimer.PLACEHOLDER_CUSTOM_TEXT()}
                      className="w-full"
                    />

                    <Button
                      faIcon={faFloppyDisk}
                      label={LL.chairs.dashboard.configurations.statusTimer.BUTTON()}
                      onClick={() => {
                        updateStatus();
                      }}
                    />
                  </div>
                </ConfigWrapper>
              </div>
            </div>
          </ScrollPanel>
        </div>
      </ToastProvider>
    </>
  );
}
