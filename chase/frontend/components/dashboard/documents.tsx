import React, { useState } from "react";
import WidgetTemplate from "./widget_template";
import Resolution from "@components/dashboard/documents/resolution";
import Draft from "@components/dashboard/documents/draft";
import Paper from "@components/dashboard/documents/paper";
import { ScrollPanel } from "primereact/scrollpanel";
import { Divider } from "primereact/divider";
import { CountryCode } from "auth";

interface Document {
  documentId: string;
  topic?: string;
  category: "paper" | "draft" | "adopted";
  shared?: boolean;
  introducedBy: CountryCode;
  sponsors?: string[];
}

export default function DocumentsWidget() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      documentId: "RES/GV/23/1",
      topic: "Resolution zur Einführung einer neuen Chairsoftware",
      category: "adopted",
      introducedBy: "deu",
      sponsors: ["gbr", "fra", "usa"],
    },
    {
      documentId: "RE/GV/23/2/1",
      category: "draft",
      introducedBy: "jam",
      sponsors: ["gbr", "fra", "usa"],
    },
    {
      documentId: "RE/GV/23/2/2",
      category: "draft",
      introducedBy: "usa",
      sponsors: ["gbr", "deu"],
    },
    {
      documentId: "AP/1",
      category: "paper",
      introducedBy: "gbr",
      shared: true,
      sponsors: ["gbr"],
    },
    {
      documentId: "AP/5",
      shared: false,
      category: "paper",
      introducedBy: "jam",
    },
  ]);

  return (
    <>
      <WidgetTemplate cardTitle="Dokumente">
        {/* TODO Find a better solution for height limiting */}
        <ScrollPanel className="custom-scrollbar" style={{ maxHeight: "50vh" }}>
          {documents.map((document: Document) => {
            if (document.category === "adopted") {
              return (
                <Resolution
                  documentId={document.documentId}
                  topic={document?.topic}
                />
              );
            }
          })}
          <Divider style={{ marginTop: "0.4em", marginBottom: "0.4em" }} />
          {documents.map((document: Document) => {
            if (document.category === "draft") {
              return (
                <Draft
                  documentId={document.documentId}
                  introducedBy={document.introducedBy}
                  sponsors={document.sponsors}
                />
              );
            }
          })}
          <Divider style={{ marginTop: "0.4em", marginBottom: "0.4em" }} />
          {documents.map((document: Document) => {
            if (document.category === "paper") {
              return (
                <Paper
                  documentId={document.documentId}
                  introducedBy={document.introducedBy}
                  sponsors={document.sponsors}
                  shared={document.shared}
                />
              );
            }
          })}
        </ScrollPanel>
      </WidgetTemplate>
    </>
  );
}
