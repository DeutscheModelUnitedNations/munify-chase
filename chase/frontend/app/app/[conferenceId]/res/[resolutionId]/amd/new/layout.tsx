import React, { useState, useEffect } from "react";

export default function NewAmendmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen flex flex-col gap-10 items-center justify-center p-10 bg-primary-900">
      <div className="flex flex-col gap-10 p-10 min-h-[60%] min-w-[60%]">
        {children}
      </div>
    </div>
  );
}
