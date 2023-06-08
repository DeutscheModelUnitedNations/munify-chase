import React from "react";
import WidgetTemplate from "@/components/dashboard/widget_template";
import SpeakerBlock from "@/components/dashboard/speakerslist/speaker_block";
import CommentBlock from "@/components/dashboard/speakerslist/comment_block";
import QueueBlock from "@/components/dashboard/speakerslist/queue_block";

import "./markdown.scss";

export default function SpeakersListWidget() {
  // Demo Data
  // TODO remove
  const myCountry = "jam";

  const currentSpeaker = {
    countryCode: "uno",
    countryName: "Generalsekretär",
    time: "2:35",
  };

  const speakersList = ["gbr", "che", "yem", "fra", "jam"];

  const currentComment = {
    countryCode: "cze",
    countryName: "Republik Tschechien",
    time: "0:23",
  };

  // const currentComment = null;  // If there is no data for current comment, the commentlist block will not be rendered

  const commentList = ["deu", "jam", "usa", "yem"];

  return (
    <>
      <WidgetTemplate cardTitle="Redeliste">
        <div className="flex-1 flex flex-col gap-3">
          <SpeakerBlock
            countryCode={currentSpeaker.countryCode}
            countryName={currentSpeaker.countryName}
            time={currentSpeaker.time}
          />
          {currentComment && (
            <CommentBlock>
              <SpeakerBlock
                countryCode={currentComment.countryCode}
                countryName={currentComment.countryName}
                time={currentComment.time}
              />
              <QueueBlock list={commentList} myCountry={myCountry} />
            </CommentBlock>
          )}
          <QueueBlock list={speakersList} myCountry={myCountry} />
        </div>
      </WidgetTemplate>
    </>
  );
}
