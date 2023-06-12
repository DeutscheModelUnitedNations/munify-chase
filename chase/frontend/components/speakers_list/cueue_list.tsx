import React from "react";
import Image from "next/image";
import { CountryCode } from "@/custom_types";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import Timeline from "@components/speakers_list/timeline";
import getCountryNameByCode from "@/misc/get_country_name_by_code";

export default function QueueList({
  list,
  myCountry,
  closed,
}: { list: CountryCode[]; myCountry: CountryCode; closed: boolean }) {

  return (
    <>
      <div className="flex flex-col mt-3">
        <Timeline list={list} content={(item) => { return <CountryCard countryCode={item} myCountry={myCountry} /> }} />
        { closed &&
          <div className="flex justify-stretch items-center gap-3 mt-3">
            <div className="flex-1 border border-gray-500" />
            <div className="text-sm font-bold text-gray-500">Liste Geschlossen</div>
            <div className="flex-1 border border-gray-500" />
          </div>
        }
        </div>
    </>
  );
}

function CountryCard({ countryCode, myCountry }: { countryCode: CountryCode, myCountry: CountryCode }) {
  let wrapperClassNames = "flex-1 w-full flex gap-4 p-2 rounded-md hover:bg-white transition";

  if (countryCode === myCountry) {
    wrapperClassNames += " bg-dmunlight";
  }

  return (
    <div className={wrapperClassNames}>
      <Flag countryCode={countryCode} />
      <div className="flex flex-col justify-center">
        <div className="text-sm font-bold">{getCountryNameByCode(countryCode)}</div>
      </div>
    </div>
  )
}

function Flag({ countryCode }: { countryCode: CountryCode }) {
  return (
    <div className="rounded-md border border-black shadow-md bg-white overflow-hidden">
      <Image
        src={getFlagPathByCode(countryCode)}
        width={39}
        height={26}
        alt="flag"
        style={{ objectFit: "cover", height: "100%" }}
      />
    </div>
  );
}