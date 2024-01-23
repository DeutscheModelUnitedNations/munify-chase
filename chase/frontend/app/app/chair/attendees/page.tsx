"use client";
import React, { useEffect, useState } from "react";
import HeaderTemplate, { HeaderInfoBox } from "@/components/header_template";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { ScrollPanel } from "primereact/scrollpanel";
import { SelectButton } from "primereact/selectbutton";
import { Attendance } from "@/custom_types/custom_types";
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
import { attendanceTestData } from "@/test_data";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface AttendanceButtonOptions {
  icon: IconProp;
  label: string;
  value: "present" | "excused" | "absent";
}

export default function ChairAttendees() {
  const { LL, locale } = useI18nContext();

  const [data, setData] = useState<Attendance[]>(attendanceTestData);
  const [presentAttendees, setPresentAttendees] = useState<number>(0);
  const [excusedAttendees, setExcusedAttendees] = useState<number>(0);
  const [absentAttendees, setAbsentAttendees] = useState<number>(0);

  const attendanceOptions: AttendanceButtonOptions[] = [
    {
      icon: faUserCheck as IconProp,
      label: LL.chairs.attendance.PRESENT(),
      value: "present",
    },
    {
      icon: faUserClock as IconProp,
      label: LL.chairs.attendance.EXCUSED(),
      value: "excused",
    },
    {
      icon: faUserXmark as IconProp,
      label: LL.chairs.attendance.ABSENT(),
      value: "absent",
    },
  ];

  useEffect(() => {
    const countGroup = (group: "present" | "excused" | "absent") => {
      return data.filter((item) => item.present === group).length;
    };

    setPresentAttendees(countGroup("present"));
    setExcusedAttendees(countGroup("excused"));
    setAbsentAttendees(countGroup("absent"));
  }, [data]);

  const justifyTemplate = (option: AttendanceButtonOptions) => {
    return (
      <>
        <FontAwesomeIcon icon={option.icon} />
        {/* <FontAwesomeIcon icon={option.icon} className="mr-2" />  Option with icon and lable
        {option.label} */}
      </>
    );
  };

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
    <>
      <div className="flex-1 flex flex-col">
        <HeaderTemplate>
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
                <CounterCell
                  count={excusedAttendees}
                  lable={LL.chairs.attendance.EXCUSED()}
                  icon={faUserClock as IconProp}
                />
                <CounterCell
                  count={absentAttendees}
                  lable={LL.chairs.attendance.ABSENT()}
                  icon={faUserXmark as IconProp}
                />
              </div>
            </HeaderInfoBox>
            <MajorityInfo name="1/2" majorityInPercent={0.50001} />
            <MajorityInfo name="2/3" majorityInPercent={0.66666} />
          </div>
        </HeaderTemplate>
        <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex-1 flex p-4 gap-4 flex-col">
            <WidgetTemplate cardTitle={LL.chairs.attendance.HEADLINE()}>
              {data?.map((attendee, index) => (
                <WidgetBoxTemplate>
                  <Flag countryCode={attendee.country} />
                  <div className="flex flex-col justify-center">
                    <div className="text-sm font-bold text-gray-text dark:text-primary-800">
                      {getCountryNameByCode(attendee.country, locale)}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <SelectButton
                    value={attendee.present}
                    onChange={(e) => {
                      setData((prevData) =>
                        prevData.map((item, i) =>
                          i === index ? { ...item, present: e.value } : item,
                        ),
                      );
                    }}
                    options={attendanceOptions}
                    itemTemplate={justifyTemplate}
                    unselectable={false}
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
