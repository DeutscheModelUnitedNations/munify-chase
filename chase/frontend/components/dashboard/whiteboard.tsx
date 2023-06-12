import React from "react";
import WidgetTemplate from "@components/widget_template";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { ScrollPanel } from "primereact/scrollpanel";

export default function WhiteboardWidget({
  markdown_content,
}: { markdown_content: string }) {
  return (
    <>
      <WidgetTemplate cardTitle="Aktuelle Hinweise">
        {/* TODO find a better solution for scaling the Whitboard Box */}
        <div
          className="flex-1 flex pl-4 bg-white rounded-md overflow-hidden"
          style={{ maxHeight: "50vh" }}
        >
          <ScrollPanel className="flex-1 custom-scrollbar">
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
