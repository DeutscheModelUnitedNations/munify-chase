import React from "react";
import WidgetTemplate from "@/components/widget_template";
import SpeakerBlock from "@/components/speakers_list/speaker_block";
import CommentBlock from "@/components/speakers_list/comment_block";
import QueueBlock from "@/components/speakers_list/queue_block";
import { CountryCode, SpeakersListData } from "@/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import "./markdown.scss";
import { AnimatePresence, motion } from "framer-motion";

/**
 * This Component is used in the Dashboard. It uses several components
 * of the speakers list realm to create a widget with the current speaker,
 * the current speaker's comment, and the queues for speakers and comments lists.
 * The queues use the special QueueBlock component, which is a condensed and more
 * compact way of displaying the queue (as opposed to the QueueList on the speakers list page).
 */

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
          <SpeakerBlock {...speakersList.currentSpeaker} />
          {commentList.currentSpeaker.countryCode && (
            <AnimatePresence>
              <motion.div
                key={speakersList.currentSpeaker.countryCode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <CommentBlock>
                  <SpeakerBlock {...commentList.currentSpeaker} />
                  <QueueBlock list={commentList.list} myCountry={myCountry} />
                </CommentBlock>
              </motion.div>
            </AnimatePresence>
          )}
          <QueueBlock list={speakersList.list} myCountry={myCountry} />
        </div>
      </WidgetTemplate>
    </>
  );
}
