import React from "react";
import Image from "next/image";
import getCountryNameByCode from "../../misc/get_country_name_by_code";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import { CountryCode } from "@/custom_types";
import HeaderTemplate from "../header_template";
import { useI18nContext } from "@/i18n/i18n-react";
import { LargeFlag } from "../flag_templates";
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
  /**
   * This Component is used in the Dashboard. It uses the HeaderTemplate
   * to create a header with the country's flag, country's name, committee name and topic.
   */

  const { LL, locale } = useI18nContext();

  return (
    <HeaderTemplate>
      <div className="flex flex-col items-start justify-center">
        <div className="text-2xl font-bold mb-1">
          {getCountryNameByCode(countryCode, locale)}
        </div>
        <div className="text-md font-bold">{committeeName}</div>
        <div className="text-md">{currentTopic}</div>
      </div>
      <LargeFlag countryCode={countryCode} />
    </HeaderTemplate>
  );
}
