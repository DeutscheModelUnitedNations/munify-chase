import React from "react";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import Document from "@components/dashboard/documents/document_template";

/** This Component is used in the Documents Widget on the Dashboard. */

export default function Resolution({
  documentId,
  topic,
}: { documentId: string; topic?: string }) {
  return (
    <Document documentId={documentId} icon={faFileContract} topic={topic} />
  );
}
