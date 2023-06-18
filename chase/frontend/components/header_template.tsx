import React from "react";

export default function HeaderTemplate({
  children,
}: { children: React.ReactNode }) {
  
/** 
 * This is a style component. It is used to create a header div for pages Like the dashboard.
 */

  return (
    <>
      <div className=" h-32 bg-gray-300 flex justify-between items-center p-4">
        {children}
      </div>
    </>
  );
}
