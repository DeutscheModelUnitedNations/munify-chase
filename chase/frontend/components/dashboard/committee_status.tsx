import React from "react";
import WidgetTemplate from "@components/widget_template";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CommitteeStatusWidget({
  currentDebateStep,
  nextDebateStep,
}: { currentDebateStep: string; nextDebateStep: string | undefined }) {
  return (
    <>
      <WidgetTemplate cardTitle="Stand der Debatte">
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
