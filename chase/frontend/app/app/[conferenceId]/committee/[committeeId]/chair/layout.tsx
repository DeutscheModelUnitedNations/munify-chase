"use client";
import { useContext } from "react";
import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import {
  faChalkboard,
  faPodium,
  faUsersLine,
  faSquareSliders,
  faNewspaper,
  faCommentExclamation,
  faInbox,
  faChartNetwork,
  faScroll,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MessageCountContext, MessageCountProvider } from "@/contexts/messages";

export default function Chair_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MessageCountProvider>
      <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
        <ChairNavbar />
        {children}
      </div>
    </MessageCountProvider>
  );
}

function ChairNavbar() {
  const { LL } = useI18nContext();
  const { messageCount } = useContext(MessageCountContext);

  return (
    <Navbar>
      <NavButton
        icon={faChartNetwork as IconProp}
        link="../../../hub/team/committees"
        title={LL.navbar.HUB()}
      />
      <div className="h-4" />
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
      <NavButton
        icon={faInbox as IconProp}
        link={"./inbox"}
        title={LL.navbar.INBOX()}
        badge={messageCount ?? 0}
      />
      <NavButton
        icon={faScroll as IconProp}
        link={"./resolutions"}
        title={LL.navbar.RESOLUTIONS()}
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
  );
}
