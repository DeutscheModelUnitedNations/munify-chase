import React from "react";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { CountryCode } from "@/custom_types";
import Document from "@components/dashboard/documents/document_template";

/** This Component is used in the Documents Widget on the Dashboard. */

export default function Draft({
  documentId,
  introducedBy,
  sponsors,
}: {
  documentId: string;
  introducedBy: CountryCode;
  sponsors?: string[];
}) {
  return (
    <Document
      documentId={documentId}
      icon={faFileLines}
      introducedBy={introducedBy}
      sponsors={sponsors}
    />
  );
}
