import React from "react";
import getCountryNameByCode from "../../misc/get_country_name_by_code";
import { CountryCode } from "@/custom_types/custom_types";
import HeaderTemplate from "../header_template";
import { useI18nContext } from "@/i18n/i18n-react";
import { LargeFlag } from "../flag_templates";
interface HeaderProps {
  countryCode: CountryCode;
  alternativeHeadline?: string;
  committeeName: string;
  currentTopic: string;
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
          {alternativeHeadline
            ? alternativeHeadline
            : getCountryNameByCode(countryCode, locale)}
        </div>
        <div className="text-md font-bold">{committeeName}</div>
        <div className="text-md">{currentTopic}</div>
      </div>
      <LargeFlag countryCode={countryCode} />
    </HeaderTemplate>
  );
}
