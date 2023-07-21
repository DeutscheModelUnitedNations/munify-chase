import { CountryCode, Speaker } from "@/custom_types";
import React from "react";
import FlipMove from "react-flip-move";

/**
 * This Component is used in the Queue List Component on the Speakers List Page.
 * It creates a list of boxes, each containing a country flag and the country name in
 * the oder of the given speakers list.
 * It uses the FlipMove Component to animate the boxes when they are added or removed from the list.
 */

export default function Timeline({
  list,
  content,
}: { list: Speaker[]; content: (item: CountryCode) => React.ReactNode }) {
  return (
    <>
      <div className="flex-1 flex flex-col">
        <FlipMove
          duration={500}
          enterAnimation="fade"
          leaveAnimation="fade"
          appearAnimation="fade"
        >
          {list.map((item) => {
            return (
              <div key={item.entryId} className="flex flex-col items-start">
                {content(item.countryCode)}
              </div>
            );
          })}
        </FlipMove>
      </div>
    </>
  );
}
