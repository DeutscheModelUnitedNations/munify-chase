import React from "react";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { CountryCode } from "@/custom_types";
import { SmallFlag } from "@/components/flag_templates";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function Paper({
  documentId,
  introducedBy,
  sponsors,
  shared,
}: {
  documentId: string;
  introducedBy: CountryCode;
  sponsors?: string[];
  shared?: boolean;
}) {
  const { LL } = useI18nContext();

  return (
    <WidgetBoxTemplate>
      <FontAwesomeIcon icon={faClipboard} className="text-gray-400 text-2xl" />
      <div className="flex-1 flex-col justify-start items-center">
        <div className="text-sm font-semibold text-gray-600">{documentId}</div>
        <div className="text-xs text-gray-400">
          {shared &&
            sponsors &&
            `${
              sponsors.length
            } ${LL.participants.dashboard.documentsWidget.SPONSORS()}`}
        </div>
      </div>
      {shared && (
        <FontAwesomeIcon icon={faShareNodes} className="text-gray-400" />
      )}
      <SmallFlag countryCode={introducedBy} />
    </WidgetBoxTemplate>
  );
}
