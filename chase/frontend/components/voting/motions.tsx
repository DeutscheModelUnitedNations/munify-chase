import React, { useEffect, useState } from "react";
import WidgetTemplate from "../widget_template";
import WidgetBoxTemplate from "../widget_box_template";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons/faFileLines";
import { Motion } from "@/custom_types";
import { faBan, faCircleQuestion, faGavel } from "@fortawesome/free-solid-svg-icons";
import NoDataPlaceholder from "../no_data_placeholder";
import { SmallFlag } from "../flag_templates";

export default function Voting() {
  const [data, setData] = useState<Motion[]>([]);

  const testData: Motion[] = [
    {
      motionId: "1",
      introducedBy: "deu",
      personalPointOfMotion: true,
      motionText:
        "Recht auf Information",
      active: true,
    },
    {
      motionId: "1",
      introducedBy: "deu",
      personalPointOfMotion: false,
      motionText:
        "Vorgezogene Abstimmung über den Resolutionsentwurf als Ganzen",
      active: false,
    },
    {
      motionId: "2",
      introducedBy: "fra",
      personalPointOfMotion: false,
      motionText:
        "Informelle Sitzung",
      active: false,
    },
    {
      motionId: "3",
      introducedBy: "cpv",
      personalPointOfMotion: false,
      motionText:
        "Abschluss der Redeliste",
      active: false,
    }
  ];

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      console.log("polling");
      setData(testData);
    }
      , 1000);
    return () => clearInterval(pollingInterval);
  }, []);

  const getIcon = (personalPointOfMotion: boolean) => {
    if (personalPointOfMotion) {
      return (
        faCircleQuestion
      );
    } else {
      return (
        faGavel
      )
    }
  };

  return (
    <>
      <WidgetTemplate cardTitle="Anträge">
        {data.length === 0 ? (
          <NoDataPlaceholder title="Keine offenen Anträge" />
        ) : (
          testData.map((motion) => {
            return (
              <WidgetBoxTemplate highlight={motion.active}>
                <FontAwesomeIcon
                  icon={getIcon(motion.personalPointOfMotion)}
                  className=" text-2xl"
                />
                <div className="flex-1 flex-col justify-start items-center">
                  <div className="text-sm font-semibold">
                    {motion.motionText}
                  </div>
                </div>
                <SmallFlag countryCode={motion.introducedBy} showNameOnHover />
              </WidgetBoxTemplate>
            );
          })
        )}
      </WidgetTemplate>
    </>
  );
}
