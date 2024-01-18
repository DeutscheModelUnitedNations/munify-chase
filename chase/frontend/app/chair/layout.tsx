"use client";

import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import {
  faChalkboard,
  faPodium,
  faScroll,
  faPollPeople,
  faUsersLine,
  faPresentationScreen,
  faSquareSliders,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function Chair_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext(); // TODO find a way to use this in the Navbar component (Layout.tsx)

  return (
    <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
      <Navbar>
        <NavButton
          icon={faSquareSliders as IconProp}
          link={"/chair/dashboard"}
          title={LL.navbar.CONFIGURATION()}
        />
        <NavButton
          icon={faUsersLine as IconProp}
          link={"/chair/attendees"}
          title={LL.navbar.ATTENDEES()}
        />
        <NavButton
          icon={faPodium as IconProp}
          link={"/chair/speakers"}
          title={LL.navbar.SPEAKERS()}
        />
        <NavButton
          icon={faPollPeople as IconProp}
          link={"/chair/voting"}
          title={LL.navbar.VOTING()}
        />
        <NavButton
          icon={faChalkboard as IconProp}
          link={"/chair/whiteboard"}
          title={LL.navbar.WHITEBOARD()}
        />
        <NavButton
          icon={faScroll as IconProp}
          link={"/chair/resolutions"}
          title={LL.navbar.RESOLUTIONS()}
        />
        <div className="h-5" />
        <NavButton
          icon={faPresentationScreen as IconProp}
          newWindow
          link="/chair/presentation"
          title={LL.navbar.PRESENTATION()}
        />
      </Navbar>
      {children}
    </div>
  );
}
