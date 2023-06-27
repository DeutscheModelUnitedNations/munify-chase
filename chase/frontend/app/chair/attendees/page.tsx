"use client";
import React, { useState } from "react";
import HeaderTemplate, { HeaderInfoBox } from "@/components/header_template";
import WidgetBoxTemplate from "@/components/widget_box_template";
import { ScrollPanel } from "primereact/scrollpanel";
import { SelectButton } from "primereact/selectbutton";
import { Attendance } from "@/custom_types";
import WidgetTemplate from "@/components/widget_template";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { NormalFlag as Flag } from "@/components/flag_templates";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserSlash,
  faUserXmark,
} from "@fortawesome/free-solid-svg-icons";
import { attendanceTestData } from "@/test_data";

interface AttendanceButtonOptions {
  icon: FontAwesomeIconProps["icon"];
  label: string;
  value: "present" | "excused" | "absent";
}

export default function ChairAttendees() {
  const { LL, locale } = useI18nContext();

  const [testData, setTestData] = useState<Attendance[]>(attendanceTestData);

  const attendanceOptions: AttendanceButtonOptions[] = [
    {
      icon: faUser,
      label: LL.chairs.attendance.PRESENT(),
      value: "present",
    },
    {
      icon: faUserXmark,
      label: LL.chairs.attendance.EXCUSED(),
      value: "excused",
    },
    {
      icon: faUserSlash,
      label: LL.chairs.attendance.ABSENT(),
      value: "absent",
    },
  ];

  const countGroup = (group: "present" | "excused" | "absent") => {
    return testData.filter((item) => item.present === group).length;
  };

  const justifyTemplate = (option: AttendanceButtonOptions) => {
    return (
      <>
        <FontAwesomeIcon icon={option.icon} className="mr-2" />
        {option.label}
      </>
    );
  };

  const MajorityInfo = ({
    name,
    majorityInPercent,
  }: {
    name: string;
    majorityInPercent: number;
  }) => {
    return (
      <HeaderInfoBox>
        <div className="flex items-center">{name}</div>
        <div className="flex items-center mt-2 text-2xl font-bold">
          {Math.ceil(countGroup("present") * majorityInPercent)}
        </div>
      </HeaderInfoBox>
    );
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <HeaderTemplate>
          <div className="flex-1 flex gap-4 h-full justify-center">
            <HeaderInfoBox>
              <div className="grid" style={{ gridTemplateColumns: "auto 1fr" }}>
                <div className="flex justify-self-center items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                </div>
                <div className="flex items-start">
                  Present:
                  <span className="font-bold ml-2">
                    {countGroup("present")}
                  </span>
                </div>
                <div className="flex justify-self-center items-center">
                  <FontAwesomeIcon icon={faUserXmark} className="mr-2" />
                </div>
                <div className="flex items-start">
                  Excused:
                  <span className="font-bold ml-2">
                    {countGroup("excused")}
                  </span>
                </div>
                <div className="flex justify-self-center items-center">
                  <FontAwesomeIcon icon={faUserSlash} className="mr-2" />
                </div>
                <div className="flex items-start">
                  Absent:
                  <span className="font-bold ml-2">{countGroup("absent")}</span>
                </div>
              </div>
            </HeaderInfoBox>
            <MajorityInfo name="1/2" majorityInPercent={0.50001} />
            <MajorityInfo name="2/3" majorityInPercent={0.66666} />
          </div>
        </HeaderTemplate>
        <ScrollPanel className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex-1 flex p-4 gap-4 flex-col">
            <WidgetTemplate cardTitle="Attendance">
              {testData?.map((attendee, index) => (
                <WidgetBoxTemplate>
                  <Flag countryCode={attendee.country} />
                  <div className="flex flex-col justify-center">
                    <div className="text-sm font-bold text-gray-text">
                      {getCountryNameByCode(attendee.country, locale)}
                    </div>
                  </div>
                  <div className="flex-1" />
                  <SelectButton
                    value={attendee.present}
                    onChange={(e) => {
                      setTestData((prevData) =>
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
