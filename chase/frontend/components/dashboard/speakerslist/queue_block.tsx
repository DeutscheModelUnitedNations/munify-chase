import React from "react";
import Image from "next/image";
import { CountryCode } from "@/custom_types";

export default function SpeakerBlock({
  list,
  myCountry,
}: { list: CountryCode[]; myCountry: CountryCode }) {
  const compressedList = () => {
    let compressedList = [];

    if (list.length > 3) {
      compressedList = list.slice(0, 3);
    } else {
      compressedList = list;
    }

    if (list.includes(myCountry)) {
      if (list.indexOf(myCountry) > 2) {
        compressedList.splice(2, 0, myCountry);
      }
    }

    return compressedList;
  };

  const getWaitingPosition = () => {
    if (list.includes(myCountry)) {
      return list.indexOf(myCountry) + 1;
    } else {
      return 0;
    }
  };

  return (
    <>
      <div className="flex gap-1">
        {list.length > 0 && (
          <>
            <Arrow arrowName="top" />
            <Flag countryCode={compressedList()[0]} />
          </>
        )}
        {list.length > 1 && (
          <>
            <Arrow arrowName="solid" />
            <Flag countryCode={compressedList()[1]} />
          </>
        )}
        {getWaitingPosition() <= 3 ? (
          list.length > 2 && (
            <>
              <Arrow arrowName="solid" />
              <Flag countryCode={compressedList()[2]} />
            </>
          )
        ) : (
          <>
            <Arrow arrowName="dashed" />
            <div className="self-center px-2 py-1 bg-dmun text-white rounded-md">
              <div className="text-sm font-bold">
                {getWaitingPosition() - 3}
              </div>
            </div>
            <Arrow arrowName="dashed" />
            <Flag countryCode={compressedList()[2]} />
          </>
        )}
      </div>
    </>
  );
}

function Flag({ countryCode }: { countryCode: CountryCode }) {
  return (
    <div className="rounded-md border border-black shadow-md bg-white overflow-hidden">
      <Image
        src={`/flags/${countryCode}.svg`}
        width={39}
        height={26}
        alt="flag"
        style={{ objectFit: "cover", height: "100%" }}
      />
    </div>
  );
}

function Arrow({ arrowName }: { arrowName: string }) {
  return (
    <div className="flex flex-col justify-center">
      <Image
        src={`/misc/flag_arrows/${arrowName}.png`}
        width={20}
        height={15}
        alt="arrow"
        style={{ objectFit: "contain", height: "100%" }}
      />
    </div>
  );
}
