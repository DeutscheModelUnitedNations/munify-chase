import React, { useState } from "react";
import WidgetTemplate from "@components/widget_template";
import Resolution from "@components/dashboard/documents/resolution";
import Draft from "@components/dashboard/documents/draft";
import Paper from "@components/dashboard/documents/paper";
import { ScrollPanel } from "primereact/scrollpanel";
import { Divider } from "primereact/divider";
import { Document } from "@/custom_types";
import { useI18nContext } from "@/src/i18n/i18n-react";
import FlipMove from "react-flip-move";

export default function DocumentsWidget({
  documents,
}: { documents: Document[] }) {
  const { LL } = useI18nContext();

  return (
    <>
      <WidgetTemplate
        cardTitle={LL.participants.dashboard.widgetHeadlines.DOCUMENTS()}
      >
        {/* TODO Find a better solution for height limiting */}
        <ScrollPanel className="custom-scrollbar" style={{ maxHeight: "50vh" }}>
          <FlipMove duration={500} enterAnimation="accordionVertical">
            {documents.map((document: Document) => {
              if (document.category === "adopted") {
                return (
                  <Resolution
                    key={document.documentId}
                    documentId={document.documentId}
                    topic={document?.topic}
                  />
                );
              }
            })}
          </FlipMove>
          <Divider style={{ marginTop: "0.4em", marginBottom: "0.4em" }} />
          <FlipMove duration={500} enterAnimation="accordionVertical">
            {documents.map((document: Document) => {
              if (document.category === "draft") {
                return (
                  <Draft
                    key={document.documentId}
                    documentId={document.documentId}
                    introducedBy={document.introducedBy}
                    sponsors={document.sponsors}
                  />
                );
              }
            })}
          </FlipMove>
          <Divider style={{ marginTop: "0.4em", marginBottom: "0.4em" }} />
          <FlipMove duration={500} enterAnimation="accordionVertical">
            {documents.map((document: Document) => {
              if (document.category === "paper") {
                return (
                  <Paper
                    key={document.documentId}
                    documentId={document.documentId}
                    introducedBy={document.introducedBy}
                    sponsors={document.sponsors}
                    shared={document.shared}
                  />
                );
              }
            })}
          </FlipMove>
        </ScrollPanel>
      </WidgetTemplate>
    </>
  );
}
