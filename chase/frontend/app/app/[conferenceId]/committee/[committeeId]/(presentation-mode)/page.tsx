"use client";
import React, { useState, useEffect, useContext } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import PresenceWidget from "@/components/attendance/presence_widget";
import TimerWidget from "@/components/dashboard/timer";
import SpeakersListBlock from "@/components/speakers_list/speakers_list_block";
import WidgetTemplate from "@/components/widget_template";
import { useBackend, type BackendInstanceType } from "@/contexts/backend";
import { Skeleton } from "primereact/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faMinus,
  faPlus,
  faPodium,
} from "@fortawesome/pro-solid-svg-icons";
import { useToast } from "@/contexts/toast";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import { StatusTimer } from "@/contexts/status_timer";
import { useMediaQuery } from "react-responsive";

type CommitteeType = Awaited<
  ReturnType<
    ReturnType<
      ReturnType<BackendInstanceType["conference"]>["committee"]
    >["get"]
  >
>["data"];
type AgendaItems = Awaited<
  ReturnType<
    ReturnType<
      ReturnType<BackendInstanceType["conference"]>["committee"]
    >["agendaItem"]["get"]
  >
>["data"];

export default function CommitteePresentationMode({
  params,
}: {
  params: { conferenceId: string; committeeId: string };
}) {
  const { LL } = useI18nContext();
  const { disableToastsOnCurrentPage } = useToast();
  const { backend } = useBackend();
  const { category } = useContext(StatusTimer);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const [committeeData, setCommitteeData] = useState<CommitteeType | null>(
    null,
  );
  const [agendaItem, setAgendaItem] = useState<AgendaItems | null>(null);

  const [remSize, setRemSize] = useState<number>(16);

  useEffect(() => {
    const presentationRem = localStorage.getItem("presentationRem");

    if (presentationRem) {
      setRemSize(parseFloat(presentationRem));
    } else {
      const bodyRem = parseFloat(getComputedStyle(document.body).fontSize);
      setRemSize(bodyRem);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${remSize}px`;
    localStorage.setItem("presentationRem", remSize.toString());
  }, [remSize]);

  async function getCommitteeData() {
    await backend.conference[params.conferenceId].committee[params.committeeId]
      .get()
      .then((response) => {
        setCommitteeData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getAgendaItems() {
    await backend.conference[params.conferenceId].committee[
      params.committeeId
    ].agendaItem
      .get()
      .then((response) => {
        setAgendaItem(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    disableToastsOnCurrentPage();
    getCommitteeData();
    getAgendaItems();
    const intervalAPICall = setInterval(() => {
      getCommitteeData();
      getAgendaItems();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);

  return (
    <>
      <div className="bg-primary-900 p-4 h-screen">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-2rem)]">
            <WidgetTemplate>
              <h1 className="text-2xl font-bold">
                {committeeData?.name ?? (
                  <Skeleton
                    width="5rem"
                    height="2rem"
                    className="!bg-primary-900"
                  />
                )}
              </h1>
              <div className="flex gap-2 items-center mt-2">
                <FontAwesomeIcon className="mx-2" icon={faPodium} />
                <h2 className="text-lg">
                  {agendaItem?.find((item) => item.isActive)?.title ?? (
                    <Skeleton
                      width="5rem"
                      height="1.75rem"
                      className="!bg-primary-900"
                    />
                  )}
                </h2>
              </div>
            </WidgetTemplate>
            <div className="hidden md:contents">
              <WidgetTemplate
                cardTitle={LL.participants.dashboard.widgetHeadlines.PRESENCE()}
              >
                <PresenceWidget />
              </WidgetTemplate>
            </div>
            <TimerWidget showOnFormalDebate={isDesktopOrLaptop} />
          </div>
          {category === "FORMAL" ? (
            <div className="flex-1 flex flex-col xl:contents gap-4">
              <div className="flex-1 flex justify-center h-[calc(100vh-2rem)]">
                <SpeakersListBlock
                  listTitle={LL.participants.speakersList.SPEAKERS_LIST()}
                  typeOfList="SPEAKERS_LIST"
                />
              </div>
              <div className="flex-1 flex justify-center h-[calc(100vh-2rem)]">
                <SpeakersListBlock
                  listTitle={LL.participants.speakersList.COMMENT_LIST()}
                  typeOfList="COMMENT_LIST"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex justify-center h-[calc(100vh-2rem)]">
              <WhiteboardWidget />
            </div>
          )}
        </div>
      </div>

      <div className="absolute flex bottom-[10px] right-[10px] bg-white bg-opacity-50 rounded-full p-[10px] gap-[10px]">
        <FontAwesomeIcon
          icon={faArrowRotateLeft}
          className="text-black text-[20px] cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out"
          onClick={() => setRemSize(16)}
        />
        <FontAwesomeIcon
          icon={faMinus}
          className="text-black text-[20px] cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out"
          onClick={() => setRemSize(remSize - 1)}
        />
        <FontAwesomeIcon
          icon={faPlus}
          className="text-black text-[20px] cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out"
          onClick={() => setRemSize(remSize + 1)}
        />
      </div>
    </>
  );
}
