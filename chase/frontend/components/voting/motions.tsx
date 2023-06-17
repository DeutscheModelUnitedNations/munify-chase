import React, { useEffect, useState } from "react";
import WidgetTemplate from "../widget_template";
import WidgetBoxTemplate from "../widget_box_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Motion } from "@/custom_types";
import { faCircleQuestion, faGavel } from "@fortawesome/free-solid-svg-icons";
import NoDataPlaceholder from "../no_data_placeholder";
import { SmallFlag } from "../flag_templates";
import { useI18nContext } from "@/src/i18n/i18n-react";
import FlipMove from "react-flip-move";
import { motionTestData } from "@/test_data";

/**
 * This Component is used on the Voting page and displays all open motions in a list format.
 * It also includes many animations, when a motion is added or removed.
 * When a motion is handeled by the chair, it can be highlighted.
 * The motions are preordered by the backend, so that the motions with most precedence are on top.
 */

export default function Voting() {
  const { LL } = useI18nContext();

  const [data, setData] = useState<Motion[]>(motionTestData);

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      console.log("polling");
      setData(motionTestData);
    }, 1000);
    return () => clearInterval(pollingInterval);
  }, []);

  const getIcon = (personalPointOfMotion: boolean) => {
    if (personalPointOfMotion) {
      return faCircleQuestion;
    } else {
      return faGavel;
    }
  };

  return (
    <>
      <WidgetTemplate cardTitle={LL.participants.voting.MOTIONS_HEADLINE()}>
        {data.length === 0 ? (
          <NoDataPlaceholder title={LL.participants.voting.NO_DATA_MOTIONS()} />
        ) : (
          <FlipMove
            duration={500}
            appearAnimation="fade"
            enterAnimation="fade"
            leaveAnimation="fade"
            className="flex-1 flex flex-col gap-2"
          >
            {data.map((motion) => {
              return (
                <div key={motion.motionId}>
                  <WidgetBoxTemplate highlight={motion.active}>
                    <FontAwesomeIcon
                      icon={getIcon(motion.personalPointOfMotion)}
                      className=" text-2xl text-gray-icon"
                    />
                    <div className="flex-1 flex-col justify-start items-center">
                      <div className="text-sm font-semibold text-gray-text">
                        {motion.motionText}
                      </div>
                    </div>
                    <SmallFlag
                      countryCode={motion.introducedBy}
                      showNameOnHover
                    />
                  </WidgetBoxTemplate>
                </div>
              );
            })}
          </FlipMove>
        )}
      </WidgetTemplate>
    </>
  );
}
