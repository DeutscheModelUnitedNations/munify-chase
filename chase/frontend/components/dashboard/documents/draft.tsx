import React from "react";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { CountryCode } from "@/custom_types";
import Document from "@components/dashboard/documents/document_template";

export default function Draft({
  documentId,
  introducedBy,
  sponsors,
}: {
  documentId: string;
  introducedBy: CountryCode;
  sponsors?: string[];
}) {
  /**
   * This Component is used in the Documents Widget on the Dashboard.
   * It it uses the Document Widget to generate a Box containing
   * a draft's ID, its sponsors, and a flag of the country. It also
   * displays a "shared" icon, if the draft is shared with others.
   */

  return (
    <Document
      documentId={documentId}
      icon={faFileLines}
      introducedBy={introducedBy}
      sponsors={sponsors}
    />
  );
}
