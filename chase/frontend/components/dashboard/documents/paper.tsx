import React from "react";
import { faClipboard } from "@fortawesome/pro-solid-svg-icons";
import { CountryCode } from "@/custom_types/custom_types";
import Document from "@components/dashboard/documents/document_template";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

/**
 * This Component is used in the Documents Widget on the Dashboard.
 * It it uses the Document Widget to generate a Box containing
 * a paper's ID, its sponsors, and a flag of the country.
 */

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
      icon={faClipboard as IconProp}
      introducedBy={introducedBy}
      sponsors={sponsors}
      shared={shared}
    />
  );
}
