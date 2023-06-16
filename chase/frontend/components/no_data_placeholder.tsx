import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";

export default function NoDataPlaceholder({
  title = "Keine Daten",
}: {
  title?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-2">
      <FontAwesomeIcon icon={faBan} className="text-2xl text-gray-icon" />
      <div className="text-lg font-bold text-gray-text">{title}</div>
    </div>
  );
}
