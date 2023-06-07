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
        {/* TODO find a better solution for scaling the Whitboard Box */}
        <div
          className="flex-1 flex pl-4 bg-white rounded-md overflow-hidden"
          style={{ maxHeight: "50vh" }}
        >
          <ScrollPanel className="flex-1">
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
