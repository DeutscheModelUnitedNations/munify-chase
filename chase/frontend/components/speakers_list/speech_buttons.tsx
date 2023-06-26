import React, { useState } from "react";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import {
  faBan,
  faDiagramNext,
  faLock,
  faLockOpen,
  faMinus,
  faPause,
  faPlay,
  faPlus,
  faPlusCircle,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useI18nContext } from "@/i18n/i18n-react";
import { CountryCode } from "@/custom_types";
import AddSpeakerOverlay from "./add_speaker";

/**
 * This component is used to display the buttons for the Speakers List and Comment List on the Speakers List Page for participants.
 * It uses the Button Component from PrimeReact.
 * The buttons are different depending on whether the participant is on the list or not.
 * If the list is closed, the button to add a participant to the list is disabled.
 * If the participant is on the list, the button to remove the participant from the list is displayed.
 * If the participant is not on the list, the button to add the participant to the list is displayed.
 */

export function ParticipantSpeechButtons({
  onSpeakersList,
  listClosed,
}: {
  onSpeakersList: boolean;
  listClosed: boolean;
}) {
  const { LL } = useI18nContext();

  return (
    <div className="flex flex-col gap-2 items-start justify-center mt-3">
      {onSpeakersList && (
        <Button
          label={LL.participants.speakersList.REMOVE_FROM_LIST_BUTTON()}
          icon={<FontAwesomeIcon icon={faBan} className="mr-2" />}
          size="small"
          severity="danger"
        />
      )}
      {!onSpeakersList && (
        <Button
          label={
            listClosed
              ? LL.participants.speakersList.LIST_CLOSED_BUTTON()
              : LL.participants.speakersList.ADD_TO_LIST_BUTTON()
          }
          icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />}
          size="small"
          disabled={listClosed}
        />
      )}
    </div>
  );
}

/**
 * This component is used to display the buttons and options for the Speakers List and Comment List on the Speakers List Page for chairs.
 * It uses the Button and SplitButton Components from PrimeReact.
 * The buttons include the functionality to open and close the list, clear the list, and add a participant to the list as well as start and pause the timer.
 * Chairs can also add or remove time from the clock and reset the clock.
 * The add speaker button opens the AddSpeakerOverlay component.
 */

export function ChairSpeechButtons({
  listOfAllCountries,
  listClosed,
  timerPaused,
  nextSpeakerQueued,
  activeSpeaker,
  typeOfList,
}: {
  listOfAllCountries: CountryCode[];
  listClosed: boolean;
  timerPaused: boolean;
  nextSpeakerQueued: boolean;
  activeSpeaker: boolean;
  typeOfList: string;
}) {
  const { LL, locale } = useI18nContext();

  const [addSpeakersOverlayVisible, setAddSpeakersOverlayVisible] =
    useState(false);

  const splitButtonItems = [
    {
      label: LL.chairs.speakersList.buttons.OPEN_LIST(),
      icon: <FontAwesomeIcon icon={faLockOpen} className="mr-2" />,
      visible: listClosed,
    },
    {
      label: LL.chairs.speakersList.buttons.CLOSE_LIST(),
      icon: <FontAwesomeIcon icon={faLock} className="mr-2" />,
      visible: !listClosed,
    },
    {
      label: LL.chairs.speakersList.buttons.CLEAR_LIST(),
      icon: <FontAwesomeIcon icon={faBan} className="mr-2" />,
      disabled: !nextSpeakerQueued,
    },
  ];

  return (
    <div className="flex gap-2 flex-col items-start justify-center mt-3">
      <div className="flex gap-2 items-center justify-center">
        <Button
          label={LL.chairs.speakersList.buttons.START_TIMER()}
          icon={<FontAwesomeIcon icon={faPlay} className="mr-2" />}
          size="small"
          visible={timerPaused && activeSpeaker}
        />
        <Button
          label={LL.chairs.speakersList.buttons.PAUSE_TIMER()}
          icon={<FontAwesomeIcon icon={faPause} className="mr-2" />}
          size="small"
          visible={!timerPaused && activeSpeaker}
          severity="danger"
        />
        <Button
          label={LL.chairs.speakersList.buttons.REMOVE_TIME()}
          icon={<FontAwesomeIcon icon={faMinus} className="mr-2" />}
          size="small"
          text
          visible={activeSpeaker}
        />
        <Button
          label={LL.chairs.speakersList.buttons.ADD_TIME()}
          icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />}
          size="small"
          text
          visible={activeSpeaker}
        />
        <Button
          label={LL.chairs.speakersList.buttons.RESET_TIMER()}
          icon={<FontAwesomeIcon icon={faRotateLeft} className="mr-2" />}
          size="small"
          text
          visible={activeSpeaker}
        />
      </div>
      <div className="flex gap-2 items-center justify-start flex-wrap">
        <Button
          label={LL.chairs.speakersList.buttons.NEXT_SPEAKER()}
          icon={<FontAwesomeIcon icon={faDiagramNext} className="mr-2" />}
          size="small"
          disabled={!nextSpeakerQueued}
          severity="warning"
        />
        <SplitButton
          label={LL.chairs.speakersList.buttons.ADD_TO_LIST()}
          icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-2" />}
          size="small"
          onClick={() => setAddSpeakersOverlayVisible(true)}
          model={splitButtonItems}
        />
        <Dialog
          header={LL.chairs.speakersList.addSpeakerOverlay.HEADLINE(typeOfList)}
          visible={addSpeakersOverlayVisible}
          onHide={() => setAddSpeakersOverlayVisible(false)}
        >
          <AddSpeakerOverlay
            listOfAllCountries={listOfAllCountries}
            listClosed={listClosed}
            closeOverlay={() => setAddSpeakersOverlayVisible(false)}
          />
        </Dialog>
      </div>
    </div>
  );
}
