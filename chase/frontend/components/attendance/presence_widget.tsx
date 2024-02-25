import React, { useState, useEffect, useContext } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { HeaderInfoBox } from "../header_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faUserCheck,
  faUserClock,
  faUserXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { backend } from "@/services/backend";
import { toastError } from "@/fetching/fetching_utils";
import { Toast } from "primereact/toast";
import { $Enums } from "../../../backend/prisma/generated/client";
import {
  ConferenceIdContext,
  CommitteeIdContext,
} from "@/contexts/committee_data";

type DelegationData = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["committee"]["committeeId"]["delegations"]["get"]
  >
>["data"];

export default function PresenceWidget({
  showExcusedSeperately = false,
  forceUpdate,
}: {
  showExcusedSeperately?: boolean;
  forceUpdate?: boolean;
}) {
  const { LL } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const [delegationData, setDelegationData] = useState<DelegationData>([]);
  const [presentAttendees, setPresentAttendees] = useState(0);
  const [excusedAttendees, setExcusedAttendees] = useState(0);
  const [absentAttendees, setAbsentAttendees] = useState(0);

  async function getDelegationData() {
    if (!conferenceId || !committeeId) return;
    await backend.conference[conferenceId].committee[committeeId].delegations
      .get()
      .then((response) => {
        setDelegationData(response.data);
      })
      .catch((error) => {
        toastError(error);
      });
  }

  useEffect(() => {
    getDelegationData();
    const intervalAPICall = setInterval(() => {
      getDelegationData();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);

  useEffect(() => {
    if (forceUpdate) {
      getDelegationData();
    }
  }, [forceUpdate]);

  const countGroup = (group: $Enums.Presence) => {
    return (
      delegationData?.filter((item) => item.members[0].presence === group)
        .length ?? 0
    );
  };

  useEffect(() => {
    setPresentAttendees(countGroup("PRESENT"));
    setExcusedAttendees(countGroup("EXCUSED"));
    setAbsentAttendees(countGroup("ABSENT"));
  }, [delegationData]);

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
        <div className="grid" style={{ gridTemplateColumns: "auto 1fr auto" }}>
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
            count={
              showExcusedSeperately
                ? absentAttendees
                : absentAttendees + excusedAttendees
            }
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
