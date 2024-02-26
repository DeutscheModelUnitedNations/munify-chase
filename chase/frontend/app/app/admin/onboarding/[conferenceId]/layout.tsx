"use client";
import { useEffect, useState, useContext } from "react";

import Button from "@/components/button";
import SettingsSidebar from "@/components/navbar/settings_sidebar";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  faFloppyDiskCircleArrowRight,
  faGears,
} from "@fortawesome/pro-solid-svg-icons";
import { useRouter } from "next/navigation";
import useMousetrap from "mousetrap-react";
import { confirmPopup } from "primereact/confirmpopup";
import { ConfirmDialog } from "primereact/confirmdialog";
import { backend } from "@/services/backend";
import { useUserIdent } from "@/contexts/user_ident";
import { ConferenceIdContext } from "@/contexts/committee_data";
import Lockout from "@/components/lockout";
import { $Enums } from "../../../../../../backend/prisma/generated/client";
import { useToast } from "@/contexts/toast";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const { toastError } = useToast();
  const router = useRouter();
  const conferenceId = useContext(ConferenceIdContext);

  const [settingsSidebarVisible, setSettingsSidebarVisible] = useState(false);

  const saveAndQuit = (e: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: e.currentTarget,
      message: LL.admin.onboarding.SAVE_AND_QUIT_MESSAGE(),
      accept: () => {
        router.push(`/app/${params.conferenceId}/hub/team/committees`);
      },
    });
  };

  useMousetrap("ctrl+shift+s", () =>
    router.push(`/app/${params.conferenceId}/hub/team/committees`),
  );

  useEffect(() => {
    if (!conferenceId) return;
    backend.conference[conferenceId]
      .get()
      .then((response) => {
        if (!response?.data?.id) {
          router.push("/login/lockout");
        }
      })
      .catch((error) => {
        toastError(error);
        router.push("/login/lockout");
      });
  }, []);

  return (
    <>
      <ConferenceIdContext.Provider value={params.conferenceId}>
        <Lockout whitelist={[$Enums.ConferenceRole.ADMIN]} />
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
      </ConferenceIdContext.Provider>
    </>
  );
}
