import { CountryCode } from "@/custom_types";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Timeline({
  list,
  content,
}: { list: CountryCode[]; content: (item: any) => React.ReactNode }) {
  return (
    <>
      <div className="flex-1 flex flex-col">
        {list.map((item, index) => {
          return (
            <div key={index} className="flex flex-col items-start">
              {content(item)}
            </div>
          );
        })}
      </div>
    </>
  );
}
