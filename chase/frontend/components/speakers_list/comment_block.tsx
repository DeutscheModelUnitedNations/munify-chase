import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";

export default function CommentBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * This Component is used on the Speakers List Page.
   * It is the main container for the Comment Components, containing
   * the current Comment and the Comment List.
   */

  const { LL } = useI18nContext();

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg p-3">
        <div className="font-bold mb-2 text-lg">
          {LL.participants.dashboard.widgetHeadlines.COMMENT_LIST()}
        </div>
        <div className="flex-1 flex flex-col gap-3">{children}</div>
      </div>
    </>
  );
}
