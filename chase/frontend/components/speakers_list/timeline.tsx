import { CountryCode, Speaker } from "@/custom_types";
import React from "react";
import FlipMove from "react-flip-move";

export default function Timeline({
  list,
  content,
}: { list: Speaker[]; content: (item: CountryCode) => React.ReactNode }) {
  return (
    <>
      <div className="flex-1 flex flex-col">
        <FlipMove
          duration={500}
          enterAnimation={"fade"}
          leaveAnimation={"fade"}
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
