import React from "react";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import Document from "@components/dashboard/documents/document_template";

export default function Resolution({
  documentId,
  topic,
}: { documentId: string; topic?: string }) {
  /**
   * This Component is used in the Documents Widget on the Dashboard.
   * It it uses the Document Widget to generate a Box containing
   * a resolution's ID and its topic.
   */
  return (
    <Document documentId={documentId} icon={faFileContract} topic={topic} />
  );
}
