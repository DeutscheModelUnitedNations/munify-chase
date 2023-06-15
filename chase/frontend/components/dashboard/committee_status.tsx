import React from "react";
import WidgetTemplate from "@components/widget_template";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function CommitteeStatusWidget({
  currentDebateStep,
  nextDebateStep,
}: { currentDebateStep: string; nextDebateStep: string | undefined }) {
  const { LL } = useI18nContext();

  return (
    <>
      <WidgetTemplate
        cardTitle={LL.participants.dashboard.widgetHeadlines.COMMITTEE_STATUS()}
      >
        <div className="flex flex-col gap-1">
          <div className="flex flex-row bg-dmun text-white rounded-md p-2 gap-4 border border-black shadow-md">
            <div className="flex-1 text-sm font-semibold text-center">
              {currentDebateStep}
            </div>
          </div>
          <FontAwesomeIcon icon={faArrowDown} />
          <div className="flex flex-row bg-white text-gray-700 rounded-md p-2 gap-4 border border-gray-700 border-dashed">
            <div className="flex-1 text-sm font-semibold text-center">
              {nextDebateStep ? nextDebateStep : "..."}
            </div>
          </div>
        </div>
      </WidgetTemplate>
    </>
  );
}
