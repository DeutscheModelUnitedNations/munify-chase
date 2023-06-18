import React from "react";
import Image from "next/image";
import getCountryNameByCode from "../../misc/get_country_name_by_code";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import { CountryCode } from "@/custom_types";

interface HeaderProps {
  countryCode: CountryCode;
  committeeName: string;
  currentTopic: string;
}

export default function DashboardHeader({
  countryCode,
  committeeName,
  currentTopic,
}: HeaderProps) {
  return (
    <div className=" h-32 bg-gray-300 flex justify-between items-center p-4">
      <div className="flex flex-col items-start justify-center">
        <div className="text-2xl font-bold mb-1">
          {getCountryNameByCode(countryCode)}
        </div>
        <div className="text-md font-bold">{committeeName}</div>
        <div className="text-md">{currentTopic}</div>
      </div>
      <div className="flex flex-col items-center rounded-md overflow-hidden border border-black shadow-lg">
        <Image
          src={getFlagPathByCode(countryCode)}
          alt="flag"
          width={130}
          height={100}
          style={{ objectFit: "contain", height: "100%" }}
        />
      </div>
    </div>
  );
}
