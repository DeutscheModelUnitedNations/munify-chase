import React, { useEffect, useState, useContext } from "react";
import HeaderTemplate from "@/components/header_template";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { ScrollPanel } from "primereact/scrollpanel";
import { SelectButton } from "primereact/selectbutton";
import ConfigWrapper from "@/components/dashboard/chair/config_wrapper";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { NormalFlag as Flag } from "@/components/flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCheck,
  faUserXmark,
  faUserClock,
} from "@fortawesome/pro-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { backend } from "@/services/backend";
import { toastError } from "@/fetching/fetching_utils";
import PresenceWidget from "@/components/attendance/presence_widget";
import {
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import { $Enums } from "../../../backend/prisma/generated/client";

export type DelegationDataType = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["committee"]["committeeId"]["delegations"]["get"]
  >
>["data"];

interface AttendanceButtonOptions {
  icon: IconProp;
  label: string;
  value: $Enums.Presence;
}

export default function AttendanceTable({
  title,
  description,
  delegationData,
  updatePresence,
}: {
  title: string;
  description?: string;
  delegationData: DelegationDataType;
  updatePresence: (
    delegationId: string,
    memberId: string,
    presence: $Enums.Presence,
  ) => void;
}) {
  const { LL, locale } = useI18nContext();

  const attendanceOptions: AttendanceButtonOptions[] = [
    {
      icon: faUserCheck as IconProp,
      label: LL.chairs.attendance.PRESENT(),
      value: $Enums.Presence.PRESENT,
    },
    {
      icon: faUserClock as IconProp,
      label: LL.chairs.attendance.EXCUSED(),
      value: $Enums.Presence.EXCUSED,
    },
    {
      icon: faUserXmark as IconProp,
      label: LL.chairs.attendance.ABSENT(),
      value: $Enums.Presence.ABSENT,
    },
  ];

  const justifyTemplate = (option: AttendanceButtonOptions) => {
    return (
      <>
        <FontAwesomeIcon icon={option.icon} />
        {/* <FontAwesomeIcon icon={option.icon} className="mr-2" />  Option with icon and lable
        {option.label} */}
      </>
    );
  };

  return (
    <>
      <ConfigWrapper title={title} description={description}>
        {delegationData?.map((attendee) => (
          <WidgetBoxTemplate>
            <Flag countryCode={attendee.nation.alpha3Code} />
            <div className="flex flex-col justify-center">
              <div className="text-sm font-bold text-gray-text dark:text-primary-800">
                <span className="mr-2 truncate">
                  {getCountryNameByCode(attendee.nation.alpha3Code, locale)}
                </span>
              </div>
            </div>
            <div className="flex-1" />
            <SelectButton
              value={attendee.members[0].presence}
              onChange={(e) =>
                updatePresence(attendee.id, attendee.members[0].id, e.value)
              }
              options={attendanceOptions}
              itemTemplate={justifyTemplate}
              allowEmpty={false}
            />
          </WidgetBoxTemplate>
        ))}
      </ConfigWrapper>
    </>
  );
}
