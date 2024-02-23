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
  faInbox,
  faList,
  faChartNetwork,
  faGears,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MyDelegationProvider } from "@/contexts/user_ident";
import { useContext } from "react";
import { ConferenceIdContext } from "@/contexts/committee_data";

export default function ChairHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);

  return (
    <MyDelegationProvider>
      <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
        <Navbar>
          <NavButton
            icon={faChartNetwork as IconProp}
            link={"./committees"}
            title={LL.navbar.HUB()}
          />
          <NavButton
            icon={faInbox as IconProp}
            link={"./inbox"}
            title={LL.navbar.INBOX()}
          />
          <NavButton
            icon={faGears as IconProp}
            link={`/app/admin/onboarding/${conferenceId}/structure`}
            title={LL.navbar.INBOX()}
          />
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
