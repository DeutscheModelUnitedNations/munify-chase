"use client";
import React, { useContext, useEffect, useState } from "react";
import Button from "@/components/button";
import Whiteboard from "@/components/whiteboard";
import {
  faArrowRotateLeft,
  faPaperPlane,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useBackend } from "@/contexts/backend";
import { useToast } from "@/contexts/toast";
import {
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import { pollBackendCall } from "@/hooks/pollBackendCall";

export default function ChairWhiteboard() {
  const { LL } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);
  const { showToast, toastError } = useToast();
  const { backend } = useBackend();

  const [whiteboardContent, setWhiteboardContent] = useState<
    string | null | undefined
  >(undefined);
  const [whiteboardContentChanged, setWhiteboardContentChanged] =
    useState<boolean>(false);
  const [whiteboardButtonLoading, setWhiteboardButtonLoading] =
    useState<boolean>(false);
  const [committeeData, triggerCommitteeData] = pollBackendCall(
    backend
      //TODO
      // biome-ignore lint/style/noNonNullAssertion:
      .conference({ conferenceId: conferenceId! })
      // biome-ignore lint/style/noNonNullAssertion:
      .committee({ committeeId: committeeId! }).get,
  );

  useEffect(() => {
    if (!whiteboardContentChanged || whiteboardContent === null) {
      setWhiteboardContent(committeeData.whiteboardContent ?? null);
    }
    setWhiteboardContent(committeeData?.whiteboardContent ?? null);
  }, [whiteboardContent]);

  useEffect(() => {
    if (whiteboardContent !== committeeData?.whiteboardContent) {
      setWhiteboardContentChanged(true);
    } else {
      setWhiteboardContentChanged(false);
    }
    if (whiteboardContent === null) {
      showToast({
        severity: "warn",
        summary: LL.chairs.whiteboard.NO_CONTENT_TOAST(),
        detail: LL.chairs.whiteboard.NO_CONTENT_TOAST_DETAILS(),
        life: 3000,
      });
    }
  }, [whiteboardContent, committeeData]);

  async function pushWhiteboardContent() {
    setWhiteboardButtonLoading(true);
    if (
      whiteboardContent === null ||
      whiteboardContent === undefined ||
      whiteboardContent === ""
    ) {
      showToast({
        severity: "warn",
        summary: LL.chairs.whiteboard.NO_CONTENT_TOAST(),
        detail: LL.chairs.whiteboard.NO_CONTENT_TOAST_DETAILS(),
        life: 3000,
      });
      setWhiteboardButtonLoading(false);
      return;
    }
    if (!conferenceId || !committeeId) return;
    await backend
      .conference({ conferenceId })
      .committee({ committeeId })
      .whiteboard.post({
        whiteboardContent: whiteboardContent,
      })
      .then((res) => {
        if (res.status >= 400)
          throw new Error("Failed to push whiteboard content");
        triggerCommitteeData();
        setWhiteboardContentChanged(false);
        setWhiteboardButtonLoading(false);
        showToast({
          severity: "success",
          summary: LL.chairs.whiteboard.SUCCESS_TOAST(),
          life: 3000,
        });
      })
      .catch((error) => {
        toastError(error);
      });
  }

  const resetWhiteboardContent = () => {
    setWhiteboardContent(committeeData?.whiteboardContent ?? "");
  };

  return (
    <>
      <div className="flex-1 flex flex-col w-full h-full gap-4 p-4">
        <div className="flex justify-end items-center gap-4">
          <Button
            label={LL.chairs.whiteboard.SAVE_BUTTON()}
            faIcon={faPaperPlane as IconProp}
            onClick={() => pushWhiteboardContent()}
            loading={whiteboardButtonLoading}
            // disabled={!whiteboardContentChanged}
          />
          <Button
            label={LL.chairs.whiteboard.RESET_BUTTON()}
            faIcon={faArrowRotateLeft as IconProp}
            severity="danger"
            onClick={() => resetWhiteboardContent()}
          />
        </div>
        <Whiteboard
          value={whiteboardContent}
          setContentFunction={setWhiteboardContent}
          className="flex-1 h-full max-h-[80vh]"
        />
      </div>
    </>
  );
}
