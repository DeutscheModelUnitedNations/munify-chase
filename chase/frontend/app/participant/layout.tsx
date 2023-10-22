"use client";

import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import {
  faComment,
  faHouse,
  faScroll,
  faSquarePollVertical,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext();

  return (
    <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
      <Navbar>
        <NavButton
          icon={faHouse}
          link={"/participant/dashboard"}
          title={LL.navbar.DASHBOARD()}
        />
        <NavButton
          icon={faComment}
          link={"/participant/speakers"}
          title={LL.navbar.SPEAKERS()}
        />
        <NavButton
          icon={faSquarePollVertical}
          link={"/participant/voting"}
          title={LL.navbar.VOTING()}
        />
        <NavButton
          icon={faScroll}
          link={"/participant/resolutions"}
          title={LL.navbar.RESOLUTIONS()}
        />
      </Navbar>
      {children}
    </div>
  );
}
