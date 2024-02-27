"use client";

import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import {
  faPodium,
  faNewspaper,
  faCommentExclamation,
  faEarthEurope,
  faEarthOceania,
  faEarthAsia,
  faEarthAfrica,
  faEarthAmericas,
  faChartNetwork,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { MyDelegationProvider, useUserIdent } from "@/contexts/user_ident";
import { useContext, useEffect, useState } from "react";
import { ConferenceIdContext } from "@/contexts/committee_data";
import { $Enums } from "../../../../../../../backend/prisma/generated/client";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);
  const { conferenceMembership } = useUserIdent();

  const [homeIcon, setHomeIcon] = useState<IconProp>(faEarthEurope);

  useEffect(() => {
    // random out of this list
    const icons = [
      faEarthOceania,
      faEarthAsia,
      faEarthAfrica,
      faEarthAmericas,
      faEarthEurope,
    ];

    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    setHomeIcon(randomIcon);
  }, []);

  return (
    <MyDelegationProvider>
      <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
        <Navbar>
          {conferenceMembership(conferenceId)?.role ===
            $Enums.ConferenceRole.NON_STATE_ACTOR && (
            <>
              <NavButton
                icon={faChartNetwork}
                link={`/app/${conferenceId}/hub/na`}
                title="Hub"
              />
              <div className="flex-1" />
            </>
          )}
          {conferenceMembership(conferenceId)?.role ===
            $Enums.ConferenceRole.GUEST && (
            <>
              <NavButton
                icon={faChartNetwork}
                link={`/app/${conferenceId}/hub/guest`}
                title="Hub"
              />
              <div className="flex-1" />
            </>
          )}
          <NavButton
            icon={homeIcon}
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
