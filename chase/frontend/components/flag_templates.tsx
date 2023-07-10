import React, { useState } from "react";
import Image from "next/image";
import { CountryCode } from "@/custom_types";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { useI18nContext } from "@/i18n/i18n-react";

/**
 * The following Components are all different sizes of flags.
 * They are used by many Components throughout the app.
 * The smalles size includes a hover flag that – when activated – shows the name of the country as a tooltip.
 */

export function SmallFlag({
  countryCode,
  showNameOnHover = false,
}: {
  countryCode: CountryCode;
  showNameOnHover?: boolean;
}) {
  const { LL, locale } = useI18nContext();

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
        className="flex-col justify-end items-center rounded-md contrast:border contrast:border-primary-100 bg-white shadow-md overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative" style={{ width: "32px", height: "24px" }}>
          <Image
            src={getFlagPathByCode(countryCode)}
            alt={`Flag of ${getCountryNameByCode(countryCode, locale)}`}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        {isHovered && showNameOnHover && (
          <div className="bg-primary text-white text-xs rounded-md shadow-md p-2 absolute mt-2">
            {getCountryNameByCode(countryCode, locale)}
          </div>
        )}
      </div>
    </div>
  );
}

export function NormalFlag({ countryCode }: { countryCode: CountryCode }) {
  return (
    <div className="rounded-md contrast:border contrast:border-primary-100 bg-white shadow-md overflow-hidden">
      <div className="relative" style={{ width: "40px", height: "30px" }}>
        <Image
          src={getFlagPathByCode(countryCode)}
          fill
          alt="flag"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

export function LargeFlag({
  countryCode,
  className,
}: {
  countryCode: CountryCode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md contrast:border contrast:border-primary-100 bg-white shadow-md overflow-hidden ${className}`}
    >
      <div className="relative" style={{ width: "100px", height: "75px" }}>
        <Image
          src={getFlagPathByCode(countryCode)}
          alt="flag"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
