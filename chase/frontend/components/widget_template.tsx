import React from "react";

interface WidgetTemplateProps {
  children: React.ReactNode;
  cardTitle: string;
  autoStyle?: boolean;
  additionalClassNames?: string;
}

/**
 * This Component is the main style template for any widget inside the app.
 * It provides a background color, a border, a border radius, a padding and a margin.
 * It is used in many Components on higher levels of the app, but with the most importance for the Dashboard.
 */

export default function WidgetTemplate({
  children,
  cardTitle,
  additionalClassNames,
}: WidgetTemplateProps) {
  const widgetClassNames = () => {
    const classNames = [
      "flex w-full flex-col bg-primary-950 dark:bg-primary-200 rounded-lg p-3",
    ];

    if (additionalClassNames) {
      classNames.push(additionalClassNames);
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
