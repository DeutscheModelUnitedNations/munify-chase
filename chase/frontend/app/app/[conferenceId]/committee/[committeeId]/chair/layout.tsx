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
  faNewspaper,
  faCommentExclamation,
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
          link={"./dashboard"}
          title={LL.navbar.CONFIGURATION()}
        />
        <NavButton
          icon={faUsersLine as IconProp}
          link={"./attendees"}
          title={LL.navbar.ATTENDEES()}
        />
        <NavButton
          icon={faPodium as IconProp}
          link={"./speakers"}
          title={LL.navbar.SPEAKERS()}
        />
        {/* <NavButton TODO add Voting page
          icon={faPollPeople as IconProp}
          link={"./voting"}
          title={LL.navbar.VOTING()} 
        /> */}
        <NavButton
          icon={faChalkboard as IconProp}
          link={"./whiteboard"}
          title={LL.navbar.WHITEBOARD()}
        />
        {/* <NavButton TODO add Resolution Editor page
          icon={faScroll as IconProp}
          link={"./resolutions"}
          title={LL.navbar.RESOLUTIONS()}
        /> */}
        <div className="h-5" />
        <NavButton
          icon={faPresentationScreen as IconProp}
          newWindow
          link="./presentation"
          title={LL.navbar.PRESENTATION()}
        />
        <div className="h-5" />
        <NavButton
          icon={faNewspaper as IconProp}
          newWindow
          link="https://presse.mun-sh.de/" // TODO make this link configurable for the chair (Link to external News Page)
          title={LL.navbar.NEWS()}
        />
        <NavButton
          icon={faCommentExclamation as IconProp}
          newWindow
          link="https://chase-fb.dmun.de"
          title={LL.navbar.BUG_REPORT()}
        />
      </Navbar>
      {children}
    </div>
  );
}
