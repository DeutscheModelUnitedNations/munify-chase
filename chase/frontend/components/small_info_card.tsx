import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Skeleton } from "primereact/skeleton";

export default function SmallInfoCard({
  icon,
  classNameForIconBox = "bg-primary-500 text-primary-500 border-primary-500",
  classNameForContentBox = "bg-primary-500",
  noFixedHeight = false,
  loading = false,
  children,
}: {
  icon: IconProp;
  classNameForIconBox?: string;
  classNameForContentBox?: string;
  noFixedHeight?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}) {
  const [loadingRandom, setLoadingRandom] = useState<number>(100);

  useEffect(() => {
    setLoadingRandom(Math.random() * (100 - 20) + 20);
  }, []);

  return (
    <div className={`w-full flex gap-1 ${noFixedHeight ? "min-h-16" : "h-16"}`}>
      <div
        className={`w-20 ${classNameForIconBox} border-l-[6px] sm:rounded-l-lg justify-center items-center w-full sm:w-auto bg-opacity-20 hidden sm:flex`}
      >
        <FontAwesomeIcon icon={icon} className="text-2xl w-16" />
      </div>
      <div
        className={`w-full rounded-lg sm:rounded-none sm:rounded-r-lg flex items-center p-4 overflow-hidden text-center sm:text-left ${
          !noFixedHeight && "truncate"
        } ${classNameForContentBox} bg-opacity-20`}
      >
        {loading ? (
          <Skeleton
            width={`${loadingRandom}%`}
            height="1.75rem"
            className="!bg-primary-800"
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
