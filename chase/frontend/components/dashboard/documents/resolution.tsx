import React from "react";
import DocumentTemplate from "@components/dashboard/documents/documenttemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Resolution({
  number,
  topic,
}: { number: string; topic?: string }) {
  return (
    <DocumentTemplate>
      <FontAwesomeIcon
        icon={faFileContract}
        className="text-gray-400 text-2xl"
      />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{number}</div>
        <div className="text-xs text-gray-400">{topic && `${topic}`}</div>
      </div>
    </DocumentTemplate>
  );
}
