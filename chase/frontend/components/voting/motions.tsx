import React from "react";
import WidgetTemplate from "../widget_template";
import WidgetBoxTemplate from "../widget_box_template";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons/faFileLines";
import { Motion } from "@/custom_types";

export default function voting() {
  const testData: Motion[] = [
    {
      motionId: "1",
      introducedBy: "deu",
      motionText:
        "Vorgezogene Abstimmung über den Resolutionsentwurf als Ganzen",
      active: true,
    },
  ];

  return (
    <>
      <WidgetTemplate cardTitle="Anträge">
        <WidgetBoxTemplate>
          {testData.map((motion) => {
            return (
              <WidgetBoxTemplate>
                <FontAwesomeIcon
                  icon={faFileLines}
                  className="text-gray-400 text-2xl"
                />
                <div className="flex-1 flex-col justify-start items-center">
                  <div className="text-sm font-semibold text-gray-600">
                    {motion.motionText}
                  </div>
                </div>
                <div className="flex-col justify-end items-center rounded-md border border-black shadow-md overflow-hidden">
                  <Image
                    src={getFlagPathByCode(motion.introducedBy)}
                    width={32}
                    height={32}
                    alt={`Flag of ${motion.introducedBy}`}
                  />
                </div>
              </WidgetBoxTemplate>
            );
          })}
        </WidgetBoxTemplate>
      </WidgetTemplate>
    </>
  );
}
