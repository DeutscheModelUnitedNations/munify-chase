import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function SpeakerBlock({ countryCode, countryName, time}) {
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
        <div className="flex-1 flex flex-col ml-2">
          <div className="font-bold text-md">{countryName}</div>
          <div className="text-md text-gray-500 flex items-center gap-3">
            <FontAwesomeIcon icon={faClock} />
            <div>{time}</div>
          </div>
        </div>
      </div>
    </>
  );
}