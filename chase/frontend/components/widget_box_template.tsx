import React from "react";

export default function WidgetBoxTemplate({
  children,
  highlight,
  className,
}: { children: React.ReactNode; highlight?: boolean, className?: string }) {

  const getClassNames = (): string => {
    let classNames =
      "flex-1 w-full flex rounded-md justify-start items-center transition-all cursor-pointer gap-4 p-2 ";

    if (highlight) {
      classNames += "bg-dmunlight text-black hover:bg-white ";
    } else {
      classNames += "hover:bg-white ";
    }

    if (className) {
      classNames += className;
    }

    return classNames;
  };

  return (
    <>
      <div className={getClassNames()}>
        {children}
      </div>
    </>
  );
}
