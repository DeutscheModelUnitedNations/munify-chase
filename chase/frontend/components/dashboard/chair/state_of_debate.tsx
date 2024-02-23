import React, { useState, useEffect, useContext } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { toastError } from "@/fetching/fetching_utils";
import ConfigWrapper from "@/components/dashboard/chair/config_wrapper";
import { Dropdown } from "primereact/dropdown";
import Button from "@/components/button";
import {
  faDiagramSubtask,
  faPencil,
  faSave,
} from "@fortawesome/pro-solid-svg-icons";
import {
  CommitteeDataContext,
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import { ToastContext } from "@/contexts/toast";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SmallInfoCard from "@/components/small_info_card";

export default function StateOfDebateWidget() {
  const { LL } = useI18nContext();
  const { showToast } = useContext(ToastContext);
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);
  const committeeData = useContext(CommitteeDataContext);

  const [stateOfDebate, setStateOfDebate] = useState<string>("");

  async function saveStateOfDebate() {
    await backend.conference[conferenceId].committee[committeeId].stateOfDebate
      .post({
        stateOfDebate: stateOfDebate,
      })
      .then((res) => {
        if (res.status === 200) {
          showToast({
            severity: "success",
            summary:
              LL.chairs.dashboard.configurations.stateOfDebate.TOAST_SUCCESS({
                state: stateOfDebate,
              }),
          });
          setStateOfDebate("");
        } else throw new Error();
      })
      .catch((e) => {
        toastError(e);
      });
  }

  return (
    <>
      <ConfigWrapper
        title={LL.chairs.dashboard.configurations.stateOfDebate.TITLE()}
        description={LL.chairs.dashboard.configurations.stateOfDebate.DESCRIPTION()}
      >
        <SmallInfoCard
          icon={faDiagramSubtask}
          color={
            committeeData?.stateOfDebate == null ||
            committeeData?.stateOfDebate === ""
              ? "bg-red-500 text-white"
              : undefined
          }
        >
          {committeeData?.stateOfDebate != null &&
          committeeData?.stateOfDebate !== "" ? (
            <h2 className="text-lg font-bold">{committeeData.stateOfDebate}</h2>
          ) : (
            <h2 className="text-lg font-bold">
              {LL.chairs.dashboard.configurations.stateOfDebate.CURRENTLY_NO_STATUS()}
            </h2>
          )}
        </SmallInfoCard>
        <div className="flex gap-2 w-full mt-4">
          <InputText
            placeholder={LL.chairs.dashboard.configurations.stateOfDebate.PLACEHOLDER_TEXT()}
            value={stateOfDebate}
            onChange={(e) => setStateOfDebate(e.target.value)}
            className="flex-1 w-full"
          />
          <Button
            faIcon={faSave}
            onClick={() => {
              saveStateOfDebate();
            }}
          />
        </div>
      </ConfigWrapper>
    </>
  );
}
