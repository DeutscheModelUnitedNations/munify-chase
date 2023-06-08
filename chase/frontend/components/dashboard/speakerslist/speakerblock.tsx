import React, { useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassStart,
  faHourglassHalf,
  faHourglassEnd,
  faClock,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import "./timeranimations.scss";


export default function SpeakerBlock({ countryCode, countryName, time }) {
  const timerState : "active" | "paused" | "overtime" = "active" ; // TODO implement this when backend is ready

  return (
    <>
      <div className="flex flex-row items-center justify-start">
        <div className="rounded-md border border-black shadow-md bg-white overflow-hidden">
          <Image
            src={`/flags/${countryCode}.svg`}
            width={99}
            height={66}
            alt="flag"
          />
        </div>
        <div className="flex-1 flex flex-col ml-4">
          <div className="font-bold text-md">{countryName}</div>
          <div className="text-md text-gray-500 flex items-center gap-3">
            {timerState === "active" && <HourglasAnimation />}
            {timerState === "paused" && <FontAwesomeIcon icon={faClock} />}
            {timerState === "overtime" && (
              <FontAwesomeIcon
                icon={faBell}
                className="text-red-700 fa-shake"
              />
            )}
            <div>{time}</div>
          </div>
        </div>
      </div>
    </>
  );
}


function HourglasAnimation() {
  const [animationState, setAnimationState] = React.useState<number>(0);
  const [icon, setIcon] = React.useState(faHourglassStart);
  const [WrapperStyleClass, setWrapperStyleClass] = React.useState<string>("hourglass");

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
  )
}