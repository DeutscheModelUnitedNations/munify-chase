import React from "react";

export default function WidgetBoxTemplate({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-1 flex rounded-md justify-start items-center hover:bg-white transition-all cursor-pointer gap-4 p-2">
        {children}
      </div>
    </>
  );
}
