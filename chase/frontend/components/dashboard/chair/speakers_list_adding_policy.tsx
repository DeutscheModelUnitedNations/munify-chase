import React, { useState, useEffect, useContext } from "react";
import { ScrollPanel } from "primereact/scrollpanel";
import { ToastContext } from "@/contexts/toast";
import DashboardHeader from "@/components/dashboard/header";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { toastError } from "@/fetching/fetching_utils";
import ConfigWrapper from "@/components/dashboard/chair/config_wrapper";
import { Dropdown } from "primereact/dropdown";
import Button from "@/components/button";
import {
  faComment,
  faFloppyDisk,
  faForwardStep,
  faLock,
  faLockOpen,
  faMugHot,
  faPencil,
  faPodium,
} from "@fortawesome/pro-solid-svg-icons";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TimerWidget from "@/components/dashboard/timer";
import WhiteboardWidget from "@/components/dashboard/whiteboard";
import PresenceWidget from "@/components/attendance/presence_widget";
import WidgetTemplate from "@/components/widget_template";
import { ToggleButton } from "primereact/togglebutton";
import {
  AgendaItemDataProvider,
  CommitteeDataContext,
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";

export default function SpeakersListAddingPolicyWidget() {
  const { LL } = useI18nContext();
  const { showToast } = useContext(ToastContext);
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);
  const committeeData = useContext(CommitteeDataContext);

  return (
    <>
      <ConfigWrapper
        title={LL.chairs.dashboard.configurations.speakersListAdding.TITLE()}
        description={LL.chairs.dashboard.configurations.speakersListAdding.DESCRIPTION()}
      >
        <ToggleButton
          onLabel={LL.chairs.dashboard.configurations.speakersListAdding.TOGGLE_BUTTON_ALLOWED()}
          offLabel={LL.chairs.dashboard.configurations.speakersListAdding.TOGGLE_BUTTON_NOT_ALLOWED()}
          onIcon={<FontAwesomeIcon icon={faLockOpen} />}
          offIcon={<FontAwesomeIcon icon={faLock} />}
          checked={committeeData?.allowDelegationsToAddThemselvesToSpeakersList}
          onChange={async (e) => {
            if (!conferenceId || !committeeId) return;
            await backend.conference[conferenceId].committee[
              committeeId
            ].delegations.toggleAllowAddingThemselvesToSpeakersList
              .post()
              .then((res) => {
                if (res.status === 200) {
                  showToast({
                    severity: "success",
                    summary:
                      LL.chairs.dashboard.configurations.speakersListAdding.TOAST_SUCCESS(),
                    detail: res.data
                      ?.allowDelegationsToAddThemselvesToSpeakersList
                      ? LL.chairs.dashboard.configurations.speakersListAdding.TOAST_SUCCESS_DETAILS_ALLOWED()
                      : LL.chairs.dashboard.configurations.speakersListAdding.TOAST_SUCCESS_DETAILS_NOT_ALLOWED(),
                  });
                } else {
                  throw new Error(
                    "Error while toggling the speakers list adding policy",
                  );
                }
              })
              .catch((err) => {
                toastError(err);
              });
          }}
        />
      </ConfigWrapper>
    </>
  );
}
