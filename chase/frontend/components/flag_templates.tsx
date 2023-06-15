import React, { useState } from "react";
import Image from "next/image";
import { CountryCode } from "@/custom_types";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import getCountryNameByCode from "@/misc/get_country_name_by_code";

export function SmallFlag({
  countryCode,
  showNameOnHover = false,
}: { countryCode: CountryCode; showNameOnHover?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="flex-col justify-end items-center rounded-md border border-black shadow-md overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={getFlagPathByCode(countryCode)}
          width={32}
          height={32}
          alt={`Flag of ${getCountryNameByCode(countryCode)}`}
          style={{ objectFit: "cover", height: "100%" }}
        />
        {isHovered && showNameOnHover && (
          <div className="bg-dmun text-white text-xs rounded-md shadow-md p-2 absolute mt-2">
            {getCountryNameByCode(countryCode)}
          </div>
        )}
      </div>
    </div>
  );
}

export function NormalFlag({ countryCode }: { countryCode: CountryCode }) {
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

export function LargeFlag({ countryCode }: { countryCode: CountryCode }) {
  return (
    <div className="rounded-md border border-black shadow-md bg-white overflow-hidden">
      <Image
        src={getFlagPathByCode(countryCode)}
        width={99}
        height={66}
        alt="flag"
      />
    </div>
  );
}
