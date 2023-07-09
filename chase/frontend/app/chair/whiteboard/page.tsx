"use client";
import Button from "@/components/button";
import Whiteboard from "@/components/whiteboard";
import {
  faArrowRotateLeft,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { whiteboardTestData } from "@/test_data";

export default function ChairWhiteboard() {
  const { LL } = useI18nContext();

  const [whiteboardContent, setWhiteboardContent] =
    React.useState<string>(whiteboardTestData);

  const pushWhiteboardContent = () => {
    console.log("Pushing whiteboard content to server...", whiteboardContent);
  };

  const resetWhiteboardContent = () => {
    console.log("Resetting whiteboard content...");
    setWhiteboardContent(whiteboardTestData);
  };

  return (
    <>
      <div className="flex-1 flex flex-col w-full h-full gap-4 p-4">
        <div className="flex justify-end items-center gap-4">
          <Button
            label={LL.chairs.whiteboard.SAVE_BUTTON()}
            faIcon={faPaperPlane}
            onClick={pushWhiteboardContent}
          />
          <Button
            label={LL.chairs.whiteboard.RESET_BUTTON()}
            faIcon={faArrowRotateLeft}
            severity="danger"
            onClick={resetWhiteboardContent}
          />
        </div>
        <Whiteboard
          value={whiteboardContent}
          setContentFunction={setWhiteboardContent}
          className="flex-1 h-full"
          style={{ maxHeight: "80vh" }}
        />
      </div>
    </>
  );
}
