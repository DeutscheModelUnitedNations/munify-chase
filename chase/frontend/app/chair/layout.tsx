"use client";

import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import {
  faChalkboard,
  faComment,
  faScroll,
  faSquarePollVertical,
  faUsersLine,
  faArrowUpRightFromSquare,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext(); // TODO NO-123 find a way to use this in the Navbar component (Layout.tsx)

  return (
    <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
      <Navbar>
        <NavButton
          icon={faSliders}
          link={"/chair/dashboard"}
          title={LL.navbar.CONFIGURATION()}
        />
        <NavButton
          icon={faUsersLine}
          link={"/chair/attendees"}
          title={LL.navbar.ATTENDEES()}
        />
        <NavButton
          icon={faComment}
          link={"/chair/speakers"}
          title={LL.navbar.SPEAKERS()}
        />
        <NavButton
          icon={faSquarePollVertical}
          link={"/chair/voting"}
          title={LL.navbar.VOTING()}
        />
        <NavButton
          icon={faChalkboard}
          link={"/chair/whiteboard"}
          title={LL.navbar.WHITEBOARD()}
        />
        <NavButton
          icon={faScroll}
          link={"/chair/resolutions"}
          title={LL.navbar.RESOLUTIONS()}
        />
        <div className="h-5" />
        <NavButton
          icon={faArrowUpRightFromSquare}
          newWindow
          link="/chair/presentation"
          title={LL.navbar.PRESENTATION()}
        />
      </Navbar>
      {children}
    </div>
  );
}
