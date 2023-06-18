import React from "react";

interface WidgetTemplateProps {
  children: React.ReactNode;
  cardTitle: string;
  styles?: string;
}
/**
    Visual only component to standardize widget styling
*/
export default function WidgetTemplate({
  children,
  cardTitle,
  styles,
}: WidgetTemplateProps) {
  const widgetClassNames = () => {
    const classNames = ["flex w-full flex-col bg-gray-light rounded-lg p-3"];

    if (styles) {
      classNames.push(styles);
    }

    return classNames.join(" ");
  };

  return (
    <>
      <div className={widgetClassNames()}>
        {cardTitle ? (
          <div className=" font-bold mb-2 text-lg">{cardTitle}</div>
        ) : null}
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
