import React, { useEffect, useState } from "react";
import WidgetTemplate from "../widget_template";
import WidgetBoxTemplate from "../widget_box_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Motion } from "@/custom_types";
import {
  faCircleCheck,
  faCircleQuestion,
  faGavel,
  faSquarePollVertical,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import NoDataPlaceholder from "../no_data_placeholder";
import { SmallFlag } from "../flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";
import FlipMove from "react-flip-move";

/**
 * This Component is used on the Voting page and displays all open motions in a list format.
 * It also includes many animations, when a motion is added or removed.
 * When a motion is handeled by the chair, it can be highlighted.
 * The motions are preordered by the backend, so that the motions with most precedence are on top.
 */

export default function Motions({
  motionData,
  highlightedMotionId,
  setActiveMotion,
}: {
  motionData: Motion[];
  highlightedMotionId?: string;
  setActiveMotion: (motionId: string) => void;
}) {
  const { LL } = useI18nContext();

  return (
    <>
      <WidgetTemplate cardTitle="">
        {motionData.length === 0 ? (
          <NoDataPlaceholder title={LL.participants.voting.NO_DATA_MOTIONS()} />
        ) : (
          <FlipMove
            duration={500}
            appearAnimation="fade"
            enterAnimation="fade"
            leaveAnimation="fade"
            className="flex-1 flex flex-col gap-2"
          >
            {motionData.map((motion) => {
              return (
                <div key={motion.motionId}>
                  <WidgetBoxTemplate
                    highlight={highlightedMotionId === motion.motionId}
                    onClick={() => setActiveMotion(motion.motionId)}
                  >
                    <SmallFlag
                      countryCode={motion.introducedBy}
                      showNameOnHover
                    />
                    <div className="flex-1 flex-col justify-start items-center">
                      <div className="text-sm font-semibold text-gray-text">
                        {motion.motionText}
                      </div>
                    </div>

                    {motion.status === "in-voting" && (
                      <FontAwesomeIcon
                        icon={faSquarePollVertical}
                        className=" text-2xl text-dmun fa-beat-fade"
                      />
                    )}

                    {(motion.status === "passed" ||
                      motion.status === "failed") &&
                      motion.voting && (
                        <FontAwesomeIcon
                          icon={faSquarePollVertical}
                          className=" text-2xl text-gray-icon"
                        />
                      )}

                    {motion.status === "passed" && (
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-2xl text-green-700"
                      />
                    )}

                    {motion.status === "failed" && (
                      <FontAwesomeIcon
                        icon={faXmarkCircle}
                        className="text-2xl text-red-600"
                      />
                    )}
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
