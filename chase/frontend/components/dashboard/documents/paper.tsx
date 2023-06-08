import React from "react";
import DocumentTemplate from "@/components/dashboard/documents/document_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Paper({
  number,
  introducedBy,
  sponsors,
  shared,
}: {
  number: string;
  introducedBy: string;
  sponsors?: string[];
  shared: boolean;
}) {
  return (
    <DocumentTemplate>
      <FontAwesomeIcon icon={faClipboard} className="text-gray-400 text-2xl" />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{number}</div>
        <div className="text-xs text-gray-400">
          {shared && sponsors && `${sponsors.length} signierte Unterstützer`}
        </div>
      </div>
      {shared && (
        <FontAwesomeIcon icon={faShareNodes} className="text-gray-400" />
      )}
      <div className="flex-col justify-end items-center rounded-md border border-black shadow-md overflow-hidden">
        <Image
          src={`/flags/${introducedBy}.svg`}
          width={32}
          height={32}
          alt={`Flag of ${introducedBy}`}
        />
      </div>
    </DocumentTemplate>
  );
}
