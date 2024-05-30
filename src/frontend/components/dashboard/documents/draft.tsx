import React from "react";
import Document from "@components/dashboard/documents/document_template";
import type { CountryCode } from "@/frontend/custom_types/custom_types";

/**
 * This Component is used in the Documents Widget on the Dashboard.
 * It it uses the Document Widget to generate a Box containing
 * a draft's ID, its sponsors, and a flag of the country. It also
 * displays a "shared" icon, if the draft is shared with others.
 */

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
      icon="file-lines"
      introducedBy={introducedBy}
      sponsors={sponsors}
    />
  );
}
