import React, { useEffect, useState, useContext } from "react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassStart,
  faHourglassHalf,
  faHourglassEnd,
  faHourglassClock,
  faBell,
} from "@fortawesome/pro-solid-svg-icons";
import "./timer_animations.scss";
import { LargeFlag } from "../flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";
import { AnimatePresence, motion } from "framer-motion";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { SpeakersListDataContext } from "@/contexts/speakers_list_data";
import NoDataPlaceholder from "../no_data_placeholder";
import { useBackendTime } from "@/contexts/backendTime";

/**
 * This Component is used in the SpeakersList. It creates a box for the current speaker,
 * containing the country's flag, country's name and the time left.
 * The time left is displayed as a timer, the prefixing icon changes depending on the status: active, paused or overtime.
 * The icon is animated, the animation is written in the Hourglass Component below and the timer_animations.scss file.
 */

export default function SpeakerBlock() {
  const { LL, locale } = useI18nContext();
  const { currentTime } = useBackendTime();
  const speakersListData = useContext(SpeakersListDataContext);

  const [timerState, setTimerState] = useState<string>("active");
  const [timeLeft, setTimeLeft] = useState<string>("0:00");
  const [countryCode, setCountryCode] = useState<string>("");
  const [timeLeftData, setTimeLeftData] = useState<number>(0);
  const [startTimestampData, setStartTimestampData] = useState<Date | null>(
    null,
  );

  useEffect(() => {
    if (
      !speakersListData?.speakers[0]?.committeeMember?.delegation?.nation
        .alpha3Code
    )
      return;
    setCountryCode(
      speakersListData.speakers[0].committeeMember.delegation.nation.alpha3Code,
    );

    if (!speakersListData?.timeLeft) return;

    if (speakersListData?.timeLeft * 1000 !== timeLeftData) {
      setTimeLeftData(speakersListData?.timeLeft * 1000);
    }

    if (speakersListData?.startTimestamp !== startTimestampData) {
      setStartTimestampData(speakersListData?.startTimestamp);
    }
  }, [speakersListData]);

  useEffect(() => {
    if (startTimestampData === null) {
      setTimerState("paused");
      setTimeLeft(displayTimer(timeLeftData || 0));
    } else {
      const timerInMilliseconds: number =
        timeLeftData -
        (currentTime.getTime() - new Date(startTimestampData).getTime());
      setTimeLeft(displayTimer(timerInMilliseconds));
      if (timerInMilliseconds < 0) {
        setTimerState("overtime");
      } else {
        setTimerState("active");
      }
    }
  }, [timeLeftData, startTimestampData, currentTime]);

  const displayTimer = (milliseconds: number) => {
    const minutes: number = Math.floor(Math.abs(milliseconds / 60000));
    const seconds: number = Math.abs(Math.floor((milliseconds % 60000) / 1000));

    if (milliseconds < 0) {
      return `-${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {speakersListData?.speakers && speakersListData?.speakers.length !== 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={countryCode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-row items-center justify-start">
              <LargeFlag countryCode={countryCode} />
              <div className="flex-1 flex flex-col ml-4">
                <div className="font-bold text-md">
                  {getCountryNameByCode(countryCode, locale)}
                </div>
                <div className="text-md text-primary-300 dark:text-primary-600 flex items-center gap-3">
                  {timerState === "active" && <HourglasAnimation />}
                  {timerState === "paused" && (
                    <FontAwesomeIcon icon={faHourglassClock as IconProp} />
                  )}
                  {timerState === "overtime" && (
                    <FontAwesomeIcon
                      icon={faBell as IconProp}
                      className="text-red-700 fa-shake"
                    />
                  )}
                  <div>{timeLeft}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex flex-col gap-2 items-start justify-center mt-3">
          <NoDataPlaceholder
            title={LL.participants.speakersList.NO_SPEAKERS_MESSAGE()}
          />
        </div>
      )}
    </>
  );
}

function HourglasAnimation() {
  const [_, setAnimationState] = React.useState<number>(0);
  const [icon, setIcon] = React.useState(faHourglassStart);
  const [WrapperStyleClass, setWrapperStyleClass] =
    React.useState<string>("hourglass");

  useEffect(() => {
    const animation = setInterval(() => {
      setTimeout(() => {
        setAnimationState(1);
        setIcon(faHourglassHalf);
      }, 500);
      setTimeout(() => {
        setAnimationState(2);
        setIcon(faHourglassEnd);
      }, 1000);
      setTimeout(() => {
        setAnimationState(3);
        setWrapperStyleClass("hourglass hourglass-animation");
      }, 1500);
      setTimeout(() => {
        setAnimationState(0);
        setIcon(faHourglassStart);
        setWrapperStyleClass("hourglass");
      }, 2000);
    }, 2000);
    return () => clearInterval(animation);
  }, []);

  return (
    <div className={WrapperStyleClass}>
      <FontAwesomeIcon icon={icon as IconProp} />
    </div>
  );
}
