import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { HeaderInfoBox } from "../header_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUserCheck, faUserClock, faUserXmark } from "@fortawesome/pro-solid-svg-icons";

export default function PresenceWidget({
  presentAttendees,
  excusedAttendees,
  absentAttendees,
  showExcusedSeperately = false,
}: {
  presentAttendees: number;
  excusedAttendees: number;
  absentAttendees: number;
  showExcusedSeperately?: boolean;
}) {
  const { LL, locale } = useI18nContext();



  const MajorityInfo = ({
    name,
    majorityInPercent: majorityInDecimal,
  }: {
    name: string;
    majorityInPercent: number;
  }) => {
    const majorityNeeded = (attendees: number) => {
      return Math.ceil(attendees * majorityInDecimal);
    };

    return (
      <HeaderInfoBox>
        <div className="flex items-center">{name}</div>
        <div className="flex items-center mt-2 text-2xl font-bold tabular-nums">
          {majorityNeeded(presentAttendees)}
        </div>
      </HeaderInfoBox>
    );
  };

  const CounterCell = ({
    count,
    lable,
    icon,
  }: {
    count: number;
    lable: string;
    icon: IconProp;
  }) => {
    return (
      <>
        <div className="flex justify-self-center items-center">
          <FontAwesomeIcon icon={icon} className="mr-2" />
        </div>
        <div className="flex items-start">{lable}:</div>
        <div className="font-bold justify-self-center items-center ml-3 tabular-nums">
          {count}
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 flex gap-4 h-full justify-center">
      <HeaderInfoBox>
        <div
          className="grid"
          style={{ gridTemplateColumns: "auto 1fr auto" }}
        >
          <CounterCell
            count={presentAttendees}
            lable={LL.chairs.attendance.PRESENT()}
            icon={faUserCheck as IconProp}
          />
          {showExcusedSeperately && (
            <CounterCell
              count={excusedAttendees}
              lable={LL.chairs.attendance.EXCUSED()}
              icon={faUserClock as IconProp}
            />
          )}
          <CounterCell
            count={showExcusedSeperately ? absentAttendees : absentAttendees + excusedAttendees}
            lable={LL.chairs.attendance.ABSENT()}
            icon={faUserXmark as IconProp}
          />
        </div>
      </HeaderInfoBox>
      <MajorityInfo name="1/2" majorityInPercent={0.50001} />
      <MajorityInfo name="2/3" majorityInPercent={0.66666} />
    </div>
  );
}
