import React from "react";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";
import Document from "@components/dashboard/documents/document_template";

export default function Resolution({
  documentId,
  topic,
}: { documentId: string; topic?: string }) {
  return (
    <Document documentId={documentId} icon={faFileContract} topic={topic} />
  );
}
