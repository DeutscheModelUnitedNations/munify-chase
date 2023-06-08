import React from "react";
import WidgetTemplate from "./widget_template";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Step {
  title: string;
  bg?: string;
  color?: string;
}

export default function CommitteeStatusWidget() {
  const [currentStep, setCurrentStep] = React.useState<Step>({
    title: "Allgemeine Debatte",
    bg: "dmun",
    color: "white",
  }); // TODO get from backend
  const [nextStep, setNextStep] = React.useState<Step>({
    title: "Debatte zum Resolutionsentwurf RE/GV/23/1",
  }); // TODO get from backend

  return (
    <>
      <WidgetTemplate cardTitle="Stand der Debatte">
        <div className="flex flex-col gap-1">
          <div
            className={`flex flex-row bg-${currentStep.bg || "white"} text-${
              currentStep.color || "black"
            } rounded-md p-2 gap-4 border border-black shadow-md`}
          >
            <div className="flex-1 text-sm font-semibold text-center">
              {currentStep.title}
            </div>
          </div>
          <FontAwesomeIcon icon={faArrowDown} />
          <div className="flex flex-row bg-white text-gray-700 rounded-md p-2 gap-4 border border-gray-700 border-dashed">
            <div className="flex-1 text-sm font-semibold text-center">
              {nextStep.title}
            </div>
          </div>
        </div>
      </WidgetTemplate>
    </>
  );
}
