import React, { useState } from "react";
import Image from "next/image";
import { CountryCode } from "@/custom_types/custom_types";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { useI18nContext } from "@/i18n/i18n-react";
import { Skeleton } from "primereact/skeleton";

/**
 * The following Components are all different sizes of flags.
 * They are used by many Components throughout the app.
 * The smalles size includes a hover flag that – when activated – shows the name of the country as a tooltip.
 */

export function SmallFlag({
  countryCode,
  showNameOnHover = false,
}: {
  countryCode?: CountryCode;
  showNameOnHover?: boolean;
}) {
  const { locale } = useI18nContext();

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex-col justify-end items-center rounded-md contrast:border contrast:border-primary-100 bg-white shadow-md overflow-hidden">
        {countryCode ? (
          <>
            <Image
              src={getFlagPathByCode(countryCode)}
              width={32}
              height={32}
              alt={`Flag of ${getCountryNameByCode(countryCode, locale)}`}
              style={{ objectFit: "cover", height: "100%" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            {showNameOnHover && (
              <div
                className={`bg-primary text-white ${
                  isHovered ? "opacity-100" : "opacity-0"
                } text-xs rounded-md shadow-md p-2 absolute mt-2 z-50 transition-all duration-300`}
              >
                {getCountryNameByCode(countryCode, locale)}
              </div>
            )}
          </>
        ) : (
          <Skeleton width="32px" height="32px" />
        )}
      </div>
    </div>
  );
}

export function NormalFlag({
  countryCode,
  showNameOnHover = false,
}: { countryCode?: CountryCode; showNameOnHover?: boolean }) {
  const { locale } = useI18nContext();

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="rounded-md contrast:border contrast:border-primary-100 bg-white shadow-md overflow-hidden">
      {countryCode ? (
        <>
          <Image
            src={getFlagPathByCode(countryCode)}
            width={39}
            height={26}
            alt="flag"
            style={{ objectFit: "cover", height: "100%" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {isHovered && showNameOnHover && (
            <div className="bg-primary text-white text-xs rounded-md shadow-md p-2 absolute mt-2 z-50">
              {getCountryNameByCode(countryCode, locale)}
            </div>
          )}
        </>
      ) : (
        <Skeleton width="39px" height="26px" />
      )}
    </div>
  );
}

export function LargeFlag({
  countryCode,
  className,
}: {
  countryCode?: CountryCode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md contrast:border contrast:border-primary-100 bg-white shadow-md overflow-hidden ${className}`}
    >
      {countryCode ? (
        <Image
          src={getFlagPathByCode(countryCode)}
          width={99}
          height={66}
          alt="flag"
        />
      ) : (
        <Skeleton width="99px" height="66px" />
      )}
    </div>
  );
}
