import { CountryCode } from "@/custom_types";
import React from "react";

interface TimelineProps {
  list: CountryCode[];
  content: (item: CountryCode) => React.ReactNode;
}

export default function Timeline({ list, content }: TimelineProps) {
  return (
    <>
      <div className="flex-1 flex flex-col">
        {list.map((item) => (
          <div className="flex flex-col items-start">{content(item)}</div>
        ))}
      </div>
    </>
  );
}
