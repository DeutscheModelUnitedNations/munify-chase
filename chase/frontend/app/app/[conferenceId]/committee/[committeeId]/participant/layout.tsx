"use client";

import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import {
  faPodium,
  faHouse,
  faScroll,
  faPollPeople,
  faNewspaper,
  faCommentExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MyDelegationProvider } from "@/contexts/user_ident";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext();

  return (
    <MyDelegationProvider>
      <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
        <Navbar>
          <NavButton
            icon={faHouse as IconProp}
            link={"./dashboard"}
            title={LL.navbar.DASHBOARD()}
          />
          <NavButton
            icon={faPodium as IconProp}
            link={"./speakers"}
            title={LL.navbar.SPEAKERS()}
          />
          {/* <NavButton TODO add Voting Page
          icon={faPollPeople as IconProp}
          link={"./voting"}
          title={LL.navbar.VOTING()}
        /> */}
          {/* <NavButton TODO add Resolution Editor page
          icon={faScroll as IconProp}
          link={"./resolutions"}
          title={LL.navbar.RESOLUTIONS()}
        /> */}
          <div className="flex-1" />
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
    </MyDelegationProvider>
  );
}
