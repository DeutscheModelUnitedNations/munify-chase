import { CountryCode } from "@/custom_types";
import React from "react";

export default function Timeline({
  list,
  content,
}: { list: CountryCode[]; content: (item: CountryCode) => React.ReactNode }) {
  return (
    <>
      <div className="flex-1 flex flex-col">
        {list.map((item) => {
          return (
            <div className="flex flex-col items-start">{content(item)}</div>
          );
        })}
      </div>
    </>
  );
}
