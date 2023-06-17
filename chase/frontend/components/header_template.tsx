import React from "react";

/**
 * This Component is the main template for any main header of a page inside the app.
 * It is a style only component, that provides a background color, a padding and a fixed height.
 */

export default function HeaderTemplate({
  children,
}: { children: React.ReactNode }) {
  return (
    <>
      <div className=" h-32 bg-gray-300 flex justify-between items-center p-4">
        {children}
      </div>
    </>
  );
}
