"use client";
import React, { useState, useEffect, useContext } from "react";
import { useBackend, type BackendInstanceType } from "@/contexts/backend";
import {
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import InboxTemplate from "@/components/inbox/inbox_template";
import Button from "@/components/button";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { ActionsOverlayResearchService } from "@/components/dashboard/actions_overlay";

type ChairMessages = Awaited<
  ReturnType<
    ReturnType<
      ReturnType<BackendInstanceType["conference"]>["committee"]
    >["messages"]["get"]
  >
>["data"];

export default function InboxPage() {
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);
  const { backend } = useBackend();

  const [messages, setMessages] = useState<ChairMessages | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<
    NonNullable<ChairMessages>[number] | null
  >(null);
  const [displayResearchDialog, setDisplayResearchDialog] = useState(false);

  async function getMessages() {
    if (!conferenceId || !committeeId) return;
    backend.conference[conferenceId].committee[committeeId].messages
      .get()
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getMessages();
    const interval = setInterval(() => {
      getMessages();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSelectedMessage(
      messages?.find((m) => m.id === selectedMessage?.id) ?? null,
    );
  }, [messages]);

  return (
    <>
      <ActionsOverlayResearchService
        showOverlay={displayResearchDialog}
        setShowOverlay={setDisplayResearchDialog}
        isChair
      />
      <InboxTemplate
        isResearchService={false}
        messages={messages}
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        getMessagesFunction={getMessages}
      />
      <div className="absolute bottom-5 right-5">
        <Button
          faIcon={faPlus}
          className="z-50"
          raised
          onClick={() => setDisplayResearchDialog(true)}
        />
      </div>
    </>
  );
}
