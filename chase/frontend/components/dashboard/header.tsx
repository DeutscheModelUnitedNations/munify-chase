import React from "react";
import getCountryNameByCode from "../../misc/get_country_name_by_code";
import HeaderTemplate from "../header_template";
import { useI18nContext } from "@/i18n/i18n-react";
import { LargeFlag } from "../flag_templates";
import { Skeleton } from "primereact/skeleton";
import { CountryCode } from "@/custom_types/custom_types";
interface HeaderProps {
  countryCode?: CountryCode;
  alternativeHeadline?: string;
  committeeName?: string;
  currentTopic?: string;
}

/**
 * This Component is used in the Dashboard. It uses the HeaderTemplate
 * to create a header with the country's flag, country's name, committee name and topic.
 * @param countryCode The country's code. If chair or other staff, use "uno" as the code.
 * @param alternativeHeadline Used to override the country's name when chair or other staff.
 * @param committeeName The name of the committee.
 * @param currentTopic The current topic of the committee.
 * @returns Header Component
 */

export default function DashboardHeader({
  countryCode,
  alternativeHeadline,
  committeeName,
  currentTopic,
}: HeaderProps) {
  const { locale } = useI18nContext();

  return (
    <HeaderTemplate>
      <div className="flex flex-col items-start justify-center">
        <div className="text-2xl font-bold mb-1">
          {countryCode ? (
            alternativeHeadline
              ? alternativeHeadline
              : getCountryNameByCode(countryCode ?? "xxx", locale)) : <Skeleton width="15rem" height="2rem" />}
        </div>
        <div className="text-md font-bold my-1">{committeeName ?? <Skeleton width="10rem" height="1.5rem" />}</div>
        <div className="text-md">{currentTopic ?? <Skeleton width="12rem" height="1.5rem" />}</div>
      </div>
      <LargeFlag countryCode={countryCode} />
    </HeaderTemplate>
  );
}
