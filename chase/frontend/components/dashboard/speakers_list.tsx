import React from "react";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import CommentBlock from "@/components/speakers_list/comment_block";
import QueueBlock from "@/components/speakers_list/queue_block";
import { CountryCode, SpeakersListData } from "@/custom_types";
import { useI18nContext } from "@/src/i18n/i18n-react";
import "./markdown.scss";

interface Speaker {
  countryCode: CountryCode;
  customName?: string;
  time: string;
}

export default function SpeakersListWidget({
  myCountry,
  speakersList,
  commentList,
}: {
  myCountry: CountryCode;
  speakersList: SpeakersListData;
  commentList: SpeakersListData;
}) {
  const { LL } = useI18nContext();

  return (
    <>
      <WidgetTemplate
        cardTitle={LL.participants.dashboard.widgetHeadlines.SPEAKERS_LIST()}
      >
        <div className="flex-1 flex flex-col gap-3">
          <SpeakerBlock
            countryCode={speakersList.currentSpeaker.countryCode}
            timer={speakersList.currentSpeaker.timer}
            customName={speakersList.currentSpeaker.customName}
          />
          {speakersList.currentSpeaker.countryCode && (
            <CommentBlock>
              <SpeakerBlock
                countryCode={commentList.currentSpeaker.countryCode}
                timer={commentList.currentSpeaker.timer}
                customName={commentList.currentSpeaker.customName}
              />
              <QueueBlock list={commentList.list} myCountry={myCountry} />
            </CommentBlock>
          )}
          <QueueBlock list={speakersList.list} myCountry={myCountry} />
        </div>
      </WidgetTemplate>
    </>
  );
}
