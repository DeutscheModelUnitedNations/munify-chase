import React, { useEffect, useState } from "react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassStart,
  faHourglassHalf,
  faHourglassEnd,
  faClock,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import "./timer_animations.scss";
import { CurrentSpeaker } from "@/custom_types";
import { LargeFlag } from "../flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SpeakerBlock({
  countryCode,
  timer,
  customName,
}: CurrentSpeaker) {
  /**
   * This Component is used in the SpeakersList. It creates a box for the current speaker,
   * containing the country's flag, country's name and the time left.
   * The time left is displayed as a timer, the prefixing icon changes depending on the status: active, paused or overtime.
   * The icon is animated, the animation is written in the Hourglass Component below and the timer_animations.scss file.
   */

  const { LL, locale } = useI18nContext();

  const [timerState, setTimerState] = useState<string>("active");
  const [timeLeft, setTimeLeft] = useState<string>("0:00");

  const displayTimer = (milliseconds: number) => {
    const minutes: number = Math.floor(Math.abs(milliseconds / 60000));
    const seconds: number = Math.abs(Math.floor((milliseconds % 60000) / 1000));

    if (milliseconds < 0) {
      return `-${minutes}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  useEffect(() => {
    if (timer.paused) {
      setTimerState("paused");
      setTimeLeft(displayTimer(timer.durationMilliseconds));
    } else {
      const timeInterval = setInterval(() => {
        const timerInMilliseconds: number =
          timer.durationMilliseconds - (Date.now() - timer.start.getTime());
        setTimeLeft(displayTimer(timerInMilliseconds));
        if (timerInMilliseconds < 0) {
          setTimerState("overtime");
        } else {
          setTimerState("active");
        }
      }, 1000);
    }
  }, [timer]);

  return (
    <>
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
                {customName || getCountryNameByCode(countryCode, locale)}
              </div>
              <div className="text-md text-gray-text flex items-center gap-3">
                {timerState === "active" && <HourglasAnimation />}
                {timerState === "paused" && <FontAwesomeIcon icon={faClock} />}
                {timerState === "overtime" && (
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-red-700 fa-shake"
                  />
                )}
                <div>{timeLeft}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function HourglasAnimation() {
  const [animationState, setAnimationState] = React.useState<number>(0);
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
      <FontAwesomeIcon icon={icon} />
    </div>
  );
}
