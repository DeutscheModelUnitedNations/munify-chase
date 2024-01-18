import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/pro-solid-svg-icons/faBan";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

/**
 * This Component is used whenever a section or widget has no data to display.
 * It displays a ban icon and a (custom) title.
 */

export default function NoDataPlaceholder({
  title = "Keine Daten",
}: {
  title?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-2">
      <FontAwesomeIcon
        icon={faBan as IconProp}
        className="text-2xl text-gray-icon dark:text-primary-500"
      />
      <div className="text-lg font-bold text-gray-text dark:text-primary-500">
        {title}
      </div>
    </div>
  );
}
