"use client";
import React, { useState } from "react";
import { ToastProvider } from "@/contexts/toast";
import SettingsSidebar from "@/components/navbar/settings_sidebar";

export default function NavigationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { conferenceId: string };
}) {

  const [settingsSidebarVisible, setSettingsSidebarVisible] = useState(false);

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}