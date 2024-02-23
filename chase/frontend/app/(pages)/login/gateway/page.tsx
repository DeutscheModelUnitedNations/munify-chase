"use client";
import React, { useEffect, useState } from "react";
import { backend } from "@/services/backend";
import {
  faCircleNotch,
  faRocket,
  faRocketLaunch,
} from "@fortawesome/pro-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "@/contexts/toast";
import Button from "@/components/button";
import { $Enums } from "../../../../../backend/prisma/generated/client";
import { LargeFlag } from "@/components/flag_templates";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { useI18nContext } from "@/i18n/i18n-react";
import Link from "next/link";

type MyInfoDataType = Awaited<
  ReturnType<typeof backend.auth.myInfo.get>
>["data"];

export default function LoginRedirectPage() {
  const router = useRouter();
  const { LL, locale } = useI18nContext();
  const { showToast } = useToast();

  const [myInfoData, setMyInfoData] = useState<MyInfoDataType | null>(null);

  async function fetchMyInfoData() {
    await backend.auth.myInfo
      .get()
      .then((res) => {
        if (res.status === 200) {
          setMyInfoData(res.data);
        } else {
          throw new Error("Failed to fetch redirect data");
        }
      })
      .catch((err) => {
        showToast({
          severity: "error",
          summary: "Error",
          detail: err.message,
        });
      });
  }

  useEffect(() => {
    fetchMyInfoData();
  }, []);

  const conferenceMemberRedirectPath = (
    conferenceMembership: MyInfoDataType["conferenceMemberships"][number],
  ) => {
    if (
      [
        $Enums.ConferenceRole.ADMIN,
        $Enums.ConferenceRole.SECRETARIAT,
        $Enums.ConferenceRole.CHAIR,
        $Enums.ConferenceRole.COMMITTEE_ADVISOR,
        $Enums.ConferenceRole.PARTICIPANT_CARE,
        $Enums.ConferenceRole.MISCELLANEOUS_TEAM,
      ].includes(conferenceMembership.role)
    )
      return `/app/${conferenceMembership.conference.id}/hub/team/committees`;
    if (conferenceMembership.role === $Enums.ConferenceRole.PRESS_CORPS) {
      return `/app/${conferenceMembership.conference.id}/hub/press`;
    }
    if (conferenceMembership.role === $Enums.ConferenceRole.NON_STATE_ACTOR) {
      return `/app/${conferenceMembership.conference.id}/hub/na`;
    }
    if (conferenceMembership.role === $Enums.ConferenceRole.GUEST) {
      return `/app/${conferenceMembership.conference.id}/hub/guests`;
    }
    throw new Error("Unknown role");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {myInfoData ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            {LL.login.gateway.TITLE()}
          </h1>
          {myInfoData.conferenceMemberships.length > 0 ? (
            <>
              <p className="mb-4 text-center">
                {myInfoData.conferenceMemberships.length === 1
                  ? LL.login.gateway.CONFERENCE_MEMBER_SINGLE()
                  : LL.login.gateway.CONFERENCE_MEMBER_MULTIPLE()}
              </p>
              {myInfoData.conferenceMemberships.map((conferenceMembership) => (
                <Button
                  key={conferenceMembership.id}
                  faIcon={faRocketLaunch}
                  label={conferenceMembership.conference.name}
                  onClick={() =>
                    router.push(
                      conferenceMemberRedirectPath(conferenceMembership),
                    )
                  }
                />
              ))}
            </>
          ) : myInfoData.committeeMemberships.length > 0 ? (
            <>
              <p className="mb-4 text-center">
                {myInfoData.committeeMemberships.length === 1
                  ? LL.login.gateway.COMMITTEE_MEMBER_SINGLE()
                  : LL.login.gateway.COMMITTEE_MEMBER_MULTIPLE()}
              </p>
              {myInfoData.committeeMemberships.map((committeeMembership) => (
                <Link
                  href={`/app/${committeeMembership.committee.conference.id}/committee/${committeeMembership.committee.id}/participant/dashboard`}
                  className="w-full flex flex-col justify-center items-center p-4 bg-primary-950 rounded-lg mb-4 hover:cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-500"
                  key={committeeMembership.committee.id}
                >
                  <h2 className="text-xl">
                    {committeeMembership.committee.conference.name}
                  </h2>
                  <h3 className="text-2xl font-bold mb-4">
                    {committeeMembership.committee.name}
                  </h3>
                  <div className="flex flex-col gap-4 justify-center items-center p-4 bg-white rounded-lg mb-6">
                    <LargeFlag
                      countryCode={
                        committeeMembership.delegation?.nation.alpha3Code ??
                        "xxx"
                      }
                    />
                    <h2 className="text-xl font-bold">
                      {getCountryNameByCode(
                        committeeMembership.delegation?.nation.alpha3Code ??
                          "xxx",
                        locale,
                      )}
                    </h2>
                  </div>
                  <Button
                    faIcon={faRocketLaunch}
                    label={LL.login.gateway.LAUNCH_BUTTON()}
                  />
                </Link>
              ))}
            </>
          ) : undefined}
        </>
      ) : (
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size="3x"
          className="text-primary-500"
        />
      )}
    </div>
  );
}
