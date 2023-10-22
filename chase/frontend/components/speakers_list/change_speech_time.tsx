import React, { useContext, useState } from "react";
import { InputMask } from "primereact/inputmask";
import { useI18nContext } from "@/i18n/i18n-react";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/pro-solid-svg-icons";
import { ToastContext } from "@/contexts/messages/toast";

/**
 * This Component is used on the SpeakersListPage for the Chair to change the speech time of the current speaker
 */

export default function ChangeSpeechTimeOverlay({
  closeOverlay,
  typeOfList,
}: {
  closeOverlay: () => void;
  typeOfList: string;
}) {
  const { LL } = useI18nContext();
  const { showToast } = useContext(ToastContext);

  const [time, setTime] = useState<string | null>(null); // TODO: Add a default value

  const validateTime = (time: string | null) => {
    if (!time) return false;
    const [minutes, seconds] = time.split(":");
    return (
      parseInt(minutes) >= 0 &&
      parseInt(minutes) <= 59 &&
      parseInt(seconds) >= 0 &&
      parseInt(seconds) <= 59
    );
  };

  const sendNewTime = (time: string | null) => {
    if (!validateTime(time)) {
      showToast({
        severity: "error",
        summary:
          LL.chairs.speakersList.changeSpeechTimeOverlay.TOAST_WRONG_FORMAT(),
        sticky: true,
      });
      return;
    }

    showToast({
      severity: "success",
      summary: LL.chairs.speakersList.changeSpeechTimeOverlay.TOAST_SUCCESS(
        time || "",
      ),
      detail:
        LL.chairs.speakersList.changeSpeechTimeOverlay.TOAST_SUCCESS_DETAIL(
          typeOfList,
        ),
      sticky: false,
    });

    closeOverlay();
  };

  return (
    <>
      <div className="flex flex-col gap-5 mt-1">
        <InputMask
          mask="99:99"
          value={time || ""}
          placeholder={LL.chairs.speakersList.changeSpeechTimeOverlay.PLACEHOLDER()}
          onChange={(e) => {
            setTime(e.value || null);
          }}
          className="w-full"
          autoFocus
        />
        <div className="flex gap-3 justify-end flex-wrap">
          <Button
            label={LL.chairs.speakersList.changeSpeechTimeOverlay.BUTTON_CANCEL()}
            icon={<FontAwesomeIcon icon={faTimes} className="mr-2" />}
            onClick={closeOverlay}
            severity="danger"
            text
          />
          <Button
            label={LL.chairs.speakersList.changeSpeechTimeOverlay.BUTTON_SET()}
            icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />}
            onClick={() => {
              sendNewTime(time);
            }}
            text
          />
        </div>
      </div>
    </>
  );
}
