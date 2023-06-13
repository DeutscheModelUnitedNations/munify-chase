import React, { useEffect, useState } from "react";
import Image from "next/image";
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
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import { CountryCode } from "@/custom_types";

interface Props {
  countryCode: CountryCode;
  timer: {
    start: Date;
    durationMilliseconds: number,
    paused: boolean, 
  };
  customName?: string;
}

export default function SpeakerBlock({ countryCode, timer, customName }: Props) {
  const [timerState, setTimerState] = useState<string>("active");
  const [timeLeft, setTimeLeft] = useState<string>("0:00");

  
  const displayTimer = (milliseconds: number) => {
    const minutes: number = Math.floor(Math.abs(milliseconds / 60000));
    const seconds: number = Math.abs(Math.floor((milliseconds % 60000) / 1000));
    
    if (milliseconds < 0) {
      return `-${minutes}:${seconds.toString().padStart(2, "0")}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

  }

  useEffect(() => {
    if (timer.paused) {
      setTimerState("paused");
      setTimeLeft(displayTimer(timer.durationMilliseconds));
    } else {
      const timeInterval = setInterval(() => {
        const timerInMilliseconds: number = timer.durationMilliseconds - (Date.now() - timer.start.getTime());
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
      <div className="flex flex-row items-center justify-start">
        <div className="rounded-md border border-black shadow-md bg-white overflow-hidden">
          <Image
            src={getFlagPathByCode(countryCode)}
            width={99}
            height={66}
            alt="flag"
          />
        </div>
        <div className="flex-1 flex flex-col ml-4">
          <div className="font-bold text-md">
            {customName || getCountryNameByCode(countryCode)}
          </div>
          <div className="text-md text-gray-500 flex items-center gap-3">
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
