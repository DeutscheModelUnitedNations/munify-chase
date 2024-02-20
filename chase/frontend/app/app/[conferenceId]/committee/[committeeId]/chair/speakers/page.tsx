"use client";
import React, { useState } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { useI18nContext } from "@/i18n/i18n-react";
import SpeakersListBlock from "@/components/speakers_list/speakers_list_block";
import { ChairSpeechButtons } from "@/components/speakers_list/speech_buttons";
import { ToastProvider } from "@/contexts/toast";
import { $Enums } from "../../../../../../../../backend/prisma/generated/client";

export default function ChairSpeakersList() {
  const { LL } = useI18nContext();

  return (
    <>
      <ToastProvider>
        <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex-1 flex p-4 gap-4 flex-col lg:flex-row">
            <SpeakersListBlock
              typeOfList={$Enums.SpeakersListCategory.SPEAKERS_LIST}
              listTitle={LL.participants.speakersList.SPEAKERS_LIST()}
              chairOptions={true}
            >
              <ChairSpeechButtons
                typeOfList={$Enums.SpeakersListCategory.SPEAKERS_LIST}
              />
            </SpeakersListBlock>
            <SpeakersListBlock
              typeOfList={$Enums.SpeakersListCategory.COMMENT_LIST}
              listTitle={LL.participants.speakersList.COMMENT_LIST()}
              chairOptions={true}
            >
              <ChairSpeechButtons
                typeOfList={$Enums.SpeakersListCategory.COMMENT_LIST}
              />
            </SpeakersListBlock>
          </div>
        </ScrollPanel>
      </ToastProvider>
    </>
  );
}
