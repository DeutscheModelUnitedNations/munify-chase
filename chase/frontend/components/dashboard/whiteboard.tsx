import React from "react";
import WidgetTemplate from "./widgettemplate";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default function WhiteboardWidget({
  markdown_content,
}: { markdown_content: string }) {
  return (
    <>
      <WidgetTemplate cardTitle="Aktuelle Hinweise">
        <div className="flex-1 flex p-4 bg-white rounded-md">
          <div className="markdown">
            <ReactMarkdown
              children={markdown_content}
              remarkPlugins={[remarkGfm]}
            />
          </div>
        </div>
      </WidgetTemplate>
    </>
  );
}
