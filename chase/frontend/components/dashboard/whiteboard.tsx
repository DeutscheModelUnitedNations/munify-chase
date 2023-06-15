import React from "react";
import WidgetTemplate from "@components/widget_template";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { ScrollPanel } from "primereact/scrollpanel";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function WhiteboardWidget({
  markdown_content,
}: { markdown_content: string }) {
  const { LL } = useI18nContext();

  return (
    <>
      <WidgetTemplate
        cardTitle={LL.participants.dashboard.widgetHeadlines.WHITEBOARD()}
      >
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
