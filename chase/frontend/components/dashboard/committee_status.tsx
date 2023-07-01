import React from "react";
import WidgetTemplate from "@components/widget_template";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useI18nContext } from "@/i18n/i18n-react";

/**
 * This Component is used in the Dashboard. It shows the current,
 * and the next step in the debate process according to the rules of procedure.
 */

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
          <div className="flex flex-row bg-primary text-white rounded-md p-2 gap-4 border border-black shadow-md">
            <div className="flex-1 text-sm font-semibold text-center">
              {currentDebateStep}
            </div>
          </div>
          <FontAwesomeIcon icon={faArrowDown} />
          <div className="flex flex-row bg-white text-gray-text rounded-md p-2 gap-4 border border-gray-text border-dashed">
            <div className="flex-1 text-sm font-semibold text-center">
              {nextDebateStep ? nextDebateStep : "..."}
            </div>
          </div>
        </div>
      </WidgetTemplate>
    </>
  );
}
