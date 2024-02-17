"use client";
import React, { useEffect, useState, useRef } from "react";
import HeaderTemplate, { HeaderInfoBox } from "@/components/header_template";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { ScrollPanel } from "primereact/scrollpanel";
import { SelectButton } from "primereact/selectbutton";
import WidgetTemplate from "@/components/widget_template";
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
import { $Enums } from "../../../../../../../../backend/prisma/generated/client";
import { Toast } from "primereact/toast";
import PresenceWidget from "@/components/attendance/presence_widget";

interface AttendanceButtonOptions {
  icon: IconProp;
  label: string;
  value: $Enums.Presence;
}

type DelegationData = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["delegations"]["get"]>>["data"];

export default function ChairAttendees(
  {
    params
  }: {
    params: { conferenceId: string; committeeId: string }
  }
) {
  const { LL, locale } = useI18nContext();

  const [data, setData] = useState<DelegationData>([]);
  const [presentAttendees, setPresentAttendees] = useState<number>(0);
  const [excusedAttendees, setExcusedAttendees] = useState<number>(0);
  const [absentAttendees, setAbsentAttendees] = useState<number>(0);

  const toast = useRef<Toast>(null);

  const attendanceOptions: AttendanceButtonOptions[] = [
    {
      icon: faUserCheck as IconProp,
      label: LL.chairs.attendance.PRESENT(),
      value: "PRESENT",
    },
    {
      icon: faUserClock as IconProp,
      label: LL.chairs.attendance.EXCUSED(),
      value: "EXCUSED",
    },
    {
      icon: faUserXmark as IconProp,
      label: LL.chairs.attendance.ABSENT(),
      value: "ABSENT",
    },
  ];

  async function getDelegationData() {
    await backend.conference[params.conferenceId].committee[params.committeeId].delegations
      .get()
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }

  useEffect(() => {
    getDelegationData();
    const intervalAPICall = setInterval(() => {
      getDelegationData();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);

  const countGroup = (group: "PRESENT" | "EXCUSED" | "ABSENT") => {
    return data?.filter((item) => item.members[0].presence === group).length ?? 0;
  };

  useEffect(() => {
    setPresentAttendees(countGroup("PRESENT"));
    setExcusedAttendees(countGroup("EXCUSED"));
    setAbsentAttendees(countGroup("ABSENT"));
  }, [data]);


  async function updatePresence(
    delegationId: string,
    memberId: string,
    presence: $Enums.Presence
  ) {
    await backend.conference[params.conferenceId].delegation[delegationId].presence[memberId]
      .post({
        presence,
      })
      .then(() => {
        getDelegationData();
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }


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
      <Toast ref={toast} />
      <div className="flex-1 flex flex-col">
        <HeaderTemplate>
          <PresenceWidget
            presentAttendees={presentAttendees}
            excusedAttendees={excusedAttendees}
            absentAttendees={absentAttendees}
          />
        </HeaderTemplate>
        <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex-1 flex p-4 gap-4 flex-col items-center">
            <WidgetTemplate
              cardTitle={LL.chairs.attendance.HEADLINE()}
              additionalClassNames="max-w-[600px]"
            >
              {data?.map((attendee, index) => (
                <WidgetBoxTemplate>
                  <Flag countryCode={attendee.nation.alpha3Code} />
                  <div className="flex flex-col justify-center">
                    <div className="text-sm font-bold text-gray-text dark:text-primary-800">
                      <span className="mr-2">
                        {getCountryNameByCode(attendee.nation.alpha3Code, locale)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1" />
                  <SelectButton
                    value={attendee.members[0].presence}
                    onChange={(e) => updatePresence(attendee.id, attendee.members[0].id, e.value)}
                    options={attendanceOptions}
                    itemTemplate={justifyTemplate}
                    allowEmpty={false}
                  />
                </WidgetBoxTemplate>
              ))}
            </WidgetTemplate>
          </div>
        </ScrollPanel>
      </div>
    </>
  );
}
