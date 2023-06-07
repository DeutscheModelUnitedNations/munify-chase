import React from "react";
import WidgetTemplate from "./widgettemplate";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { ScrollPanel } from "primereact/scrollpanel";

export default function WhiteboardWidget({
  markdown_content,
}: { markdown_content: string }) {
  return (
    <>
      <WidgetTemplate cardTitle="Aktuelle Hinweise" styles="flex-1">
        <div className="flex-1 flex px-4 bg-white rounded-md">
          {/* TODO find a better solution for scaling the Whitboard Box */}
          <ScrollPanel
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "50vh" }}
          >
            <div className="markdown">
              <ReactMarkdown
                children={markdown_content}
                remarkPlugins={[remarkGfm]}
              />
            </div>
          </ScrollPanel>
        </div>
      </WidgetTemplate>
    </>
  );
}
