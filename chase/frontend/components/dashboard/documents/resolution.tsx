import React from "react";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

export default function Resolution({
  documentId,
  topic,
}: { documentId: string; topic?: string }) {
  return (
    <WidgetBoxTemplate>
      <FontAwesomeIcon
        icon={faFileContract}
        className="text-gray-400 text-2xl"
      />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{documentId}</div>
        <div className="text-xs text-gray-400">{topic && `${topic}`}</div>
      </div>
    </WidgetBoxTemplate>
  );
}
