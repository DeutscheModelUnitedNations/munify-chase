"use client";
import React, { useState } from "react";
import SettingsSidebar from "@/components/navbar/settings_sidebar";
import { MessageCountProvider } from "@/contexts/messages";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settingsSidebarVisible, setSettingsSidebarVisible] = useState(false);

  return (
    <MessageCountProvider>
      <div className="flex justify-center items-start min-h-screen bg-primary">
        <div className="flex-1 flex flex-col justify-center items-center m-10 mt-20">
          <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-primary-200 w-11/12 p-5 rounded-md shadow-lg">
            {children}
          </div>
        </div>
      </div>
      <SettingsSidebar
        settingsSidebarVisible={settingsSidebarVisible}
        setSettingsSidebarVisible={setSettingsSidebarVisible}
      />
    </MessageCountProvider>
  );
}
