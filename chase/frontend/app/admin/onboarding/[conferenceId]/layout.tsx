"use client";
import { useState } from "react";

import Button from "@/components/button";
import SettingsSidebar from "@/components/navbar/settings_sidebar";
import { ToastProvider } from "@/contexts/messages/toast";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  faFloppyDiskCircleArrowRight,
  faGears,
} from "@fortawesome/pro-solid-svg-icons";
import { useRouter } from "next/navigation";
import useMousetrap from "mousetrap-react";
import { confirmPopup } from "primereact/confirmpopup";
import { ConfirmDialog } from "primereact/confirmdialog";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const router = useRouter();

  const [settingsSidebarVisible, setSettingsSidebarVisible] = useState(false);

  const saveAndQuit = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: LL.admin.onboarding.SAVE_AND_QUIT_MESSAGE(),
      accept: () => {
        router.push(`/admin/${params.conferenceId}/dashboard`);
      },
    });
  };

  useMousetrap("ctrl+shift+s", () => saveAndQuit());

  return (
    <ToastProvider>
      <ConfirmDialog />
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
              onClick={(event) => saveAndQuit(event)}
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
