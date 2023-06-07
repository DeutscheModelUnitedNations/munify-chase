import React from "react";
import DocumentTemplate from "@components/dashboard/documents/documenttemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Draft({
  number,
  introducedBy,
  sponsors,
}: { number: string; introducedBy: string; sponsors: string[] }) {
  return (
    <DocumentTemplate>
      <FontAwesomeIcon icon={faFileLines} className="text-gray-400 text-2xl" />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{number}</div>
        <div className="text-xs text-gray-400">{`${sponsors.length} signierte Unterstützer`}</div>
      </div>
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
