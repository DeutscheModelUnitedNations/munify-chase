import React from "react";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import { CountryCode } from "@/custom_types";

export default function Paper({
  documentId,
  introducedBy,
  sponsors,
  shared,
}: {
  documentId: string;
  introducedBy: CountryCode;
  sponsors?: string[];
  shared?: boolean;
}) {
  return (
    <WidgetBoxTemplate>
      <FontAwesomeIcon icon={faClipboard} className="text-gray-400 text-2xl" />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{documentId}</div>
        <div className="text-xs text-gray-400">
          {shared && sponsors && `${sponsors.length} signierte Unterstützer`}
        </div>
      </div>
      {shared && (
        <FontAwesomeIcon icon={faShareNodes} className="text-gray-400" />
      )}
      <div className="flex-col justify-end items-center rounded-md border border-black shadow-md overflow-hidden">
        <Image
          src={getFlagPathByCode(introducedBy)}
          width={32}
          height={32}
          alt={`Flag of ${introducedBy}`}
        />
      </div>
    </WidgetBoxTemplate>
  );
}
