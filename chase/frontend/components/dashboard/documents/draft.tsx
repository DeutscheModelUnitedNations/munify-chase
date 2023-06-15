import React from "react";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { CountryCode } from "@/custom_types";
import { SmallFlag } from "@/components/flag_templates";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function Draft({
  documentId,
  introducedBy,
  sponsors,
}: { documentId: string; introducedBy: CountryCode; sponsors?: string[] }) {
  const { LL } = useI18nContext();

  return (
    <WidgetBoxTemplate>
      <FontAwesomeIcon icon={faFileLines} className="text-gray-400 text-2xl" />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{documentId}</div>
        {sponsors && (
          <div className="text-xs text-gray-400">{`${
            sponsors?.length
          } ${LL.participants.dashboard.documentsWidget.SPONSORS()}`}</div>
        )}
      </div>
      <SmallFlag countryCode={introducedBy} />
    </WidgetBoxTemplate>
  );
}
