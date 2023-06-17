import React from "react";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { CountryCode } from "@/custom_types";
import Document from "@components/dashboard/documents/document_template";

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
    <Document
      documentId={documentId}
      icon={faClipboard}
      introducedBy={introducedBy}
      sponsors={sponsors}
      shared={shared}
    />
  );
}
