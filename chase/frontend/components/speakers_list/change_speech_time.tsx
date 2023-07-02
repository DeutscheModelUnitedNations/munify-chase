import React, { useEffect, useState } from "react";
import { InputMask } from "primereact/inputmask";
import { useI18nContext } from "@/i18n/i18n-react";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { CountryCode } from "@/custom_types";

/** TODO: Add description
 */

export default function ChangeSpeechTimeOverlay({
  closeOverlay,
}: {
  closeOverlay: () => void;
}) {
  const { LL } = useI18nContext();

  const [time, setTime] = useState<string | null>(null); // TODO: Add a default value

  const calculateSecondsFromTime = (time: string | null) => {
    if (!time) return 0;
    const [minutes, seconds] = time.split(":");
    return parseInt(minutes) * 60 + parseInt(seconds);
  };

  const sendNewTime = (time: string | null) => {
    if (!time) return;

    console.log(
      `API call to change the speech time (in seconds): ${calculateSecondsFromTime(
        time,
      )}`,
    );
  };

  // TODO implement a warning when the time is not set correctly and dont allow the dialog to be closed

  return (
    <>
      <div className="flex flex-col gap-5 mt-1">
        <InputMask
          mask="99:99"
          value={time || ""}
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
              closeOverlay();
            }}
            text
          />
        </div>
      </div>
    </>
  );
}
