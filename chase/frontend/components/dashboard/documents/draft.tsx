import React from "react";
import DocumentTemplate from "@/components/dashboard/documents/document_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import { CountryCode } from "@/custom_types";

export default function Draft({
  documentId,
  introducedBy,
  sponsors,
}: { documentId: string; introducedBy: CountryCode; sponsors?: string[] }) {
  return (
    <DocumentTemplate>
      <FontAwesomeIcon icon={faFileLines} className="text-gray-400 text-2xl" />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{documentId}</div>
        {sponsors && (
          <div className="text-xs text-gray-400">{`${sponsors?.length} signierte Unterstützer`}</div>
        )}
      </div>
      <div className="flex-col justify-end items-center rounded-md border border-black shadow-md overflow-hidden">
        <Image
          src={getFlagPathByCode(introducedBy)}
          width={32}
          height={32}
          alt={`Flag of ${introducedBy}`}
        />
      </div>
    </DocumentTemplate>
  );
}
