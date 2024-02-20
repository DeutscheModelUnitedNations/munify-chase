import React from "react";
import FlipMove from "react-flip-move";
import { SpeakersListData } from "./speakers_list_block";
import { useI18nContext } from "@/i18n/i18n-react";

/**
 * This Component is used in the Queue List Component on the Speakers List Page.
 * It creates a list of boxes, each containing a country flag and the country name in
 * the oder of the given speakers list.
 * It uses the FlipMove Component to animate the boxes when they are added or removed from the list.
 */

export default function Timeline({
  list,
  content,
}: {
  list?: SpeakersListData.speakers;
  content: (item: SpeakersListData.speakers[number]) => React.ReactNode;
}) {
  const { LL } = useI18nContext();
  return (
    <>
      <div className="flex-1 flex flex-col">
        {/* <FlipMove
          // TODO: Fix this
          duration={500}
          enterAnimation="fade"
          leaveAnimation="fade"
          appearAnimation="fade"
        > */}
        {list?.length && list.length !== 0 ? (
          list.map((item) => {
            return (
              <div key={item.id} className="flex flex-col items-start">
                {content(item)}
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center">
            <p className="text-gray-500 text-sm">
              {LL.participants.speakersList.NO_SPEAKERS_MESSAGE()}
            </p>
          </div>
        )}
        {/* </FlipMove> */}
      </div>
    </>
  );
}
