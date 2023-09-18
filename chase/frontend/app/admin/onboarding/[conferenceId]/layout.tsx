"use client";
import Button from "@/components/button";
import SettingsSidebar from "@/components/navbar/settings_sidebar";
import { ToastProvider } from "@/contexts/messages/toast";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  faFloppyDiskCircleArrowRight,
  faGears,
} from "@fortawesome/pro-solid-svg-icons";
import { useState } from "react";
import useMousetrap from "mousetrap-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext();

  const [settingsSidebarVisible, setSettingsSidebarVisible] = useState(false);

  const saveAndExit = () => {
    console.log("save and exit");
  }

  useMousetrap("ctrl+shift+s", () => saveAndExit());

  return (
    <ToastProvider>
      <div className="flex justify-center items-start min-h-screen bg-primary">
        <div className="flex-1 flex flex-col justify-center items-center m-10 mt-20">
          <div className="absolute top-4 right-4 flex gap-2 w-full justify-end">
            <Button
              faIcon={faGears}
              severity="secondary"
              onClick={() => {
                setSettingsSidebarVisible(true);
              }}
              />
            <Button
              label={LL.admin.onboarding.SAVE_AND_QUIT()}
              faIcon={faFloppyDiskCircleArrowRight}
              severity="secondary"
              onClick={saveAndExit}
              keyboardShortcut="Ctrl + ⇧ + S"
            />
          </div>
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
