"use client";
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/button";
import Whiteboard from "@/components/whiteboard";
import {
  faArrowRotateLeft,
  faPaperPlane,
} from "@fortawesome/pro-solid-svg-icons";
import { useI18nContext } from "@/i18n/i18n-react";
import { whiteboardTestData } from "@/test_data";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { backend } from "@/services/backend";
import { toastError } from "@/fetching/fetching_utils";
import { Toast } from "primereact/toast";

type Committee = Awaited<ReturnType<typeof backend.conference["conferenceId"]["committee"]["committeeId"]["get"]>>["data"];


export default function ChairWhiteboard(
  {
    params
  }: {
    params: { conferenceId: string; committeeId: string }
  }
) {
  const { LL } = useI18nContext();

  const [whiteboardContent, setWhiteboardContent] = useState<string | null | undefined>(undefined);
  const [whiteboardContentChanged, setWhiteboardContentChanged] = useState<boolean>(false);
  const [whiteboardButtonLoading, setWhiteboardButtonLoading] = useState<boolean>(false);
  const [committeeData, setCommitteeData] = useState<Committee | null>(null);
  const toast = useRef(null);

  async function getCommitteeData() {
    await backend.conference[params.conferenceId].committee[params.committeeId]
      .get()
      .then((response) => {
        setCommitteeData(response.data);
        if (!whiteboardContentChanged || whiteboardContent === null) {
          setWhiteboardContent(response.data?.whiteboardContent ?? null);
        }
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  }

  useEffect(() => {
    getCommitteeData();
    const intervalAPICall = setInterval(() => {
      getCommitteeData();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);


  useEffect(() => {
    if (whiteboardContent !== committeeData?.whiteboardContent) {
      setWhiteboardContentChanged(true);
    } else {
      setWhiteboardContentChanged(false);
    }
    if (whiteboardContent === null) {
      toast.current?.show({
        severity: "warn",
        summary: LL.chairs.whiteboard.NO_CONTENT_TOAST(),
        detail: LL.chairs.whiteboard.NO_CONTENT_TOAST_DETAILS(),
        life: 3000,
      });
    }
  }, [whiteboardContent, committeeData]);


  async function pushWhiteboardContent() {
    setWhiteboardButtonLoading(true);
    if (whiteboardContent === null || whiteboardContent === undefined || whiteboardContent === "") {
      toast.current?.show({
        severity: "warn",
        summary: LL.chairs.whiteboard.NO_CONTENT_TOAST(),
        detail: LL.chairs.whiteboard.NO_CONTENT_TOAST_DETAILS(),
        life: 3000,
      });
      setWhiteboardButtonLoading(false);
      return;
    }
    await backend.conference[params.conferenceId].committee[params.committeeId].whiteboard
      .post({
        whiteboardContent: whiteboardContent,
      })
      .then((response) => {
        getCommitteeData();
        setWhiteboardContentChanged(false);
        setWhiteboardButtonLoading(false);
        toast.current?.show({
          severity: "success",
          summary: LL.chairs.whiteboard.SUCCESS_TOAST(),
          life: 3000,
        });
      })
      .catch((error) => {
        toastError(toast, LL, error);
      });
  };

  const resetWhiteboardContent = () => {
    setWhiteboardContent(committeeData?.whiteboardContent ?? "");
  };

  return (
    <>
      <Toast ref={toast} />
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
