"use client";
import React, { useState, useEffect, useContext } from "react";
import { useBackend, type BackendInstanceType } from "@/contexts/backend";
import { ConferenceIdContext } from "@/contexts/committee_data";
import InboxTemplate from "@/components/inbox/inbox_template";

type ChairMessages = Awaited<
  ReturnType<
    BackendInstanceType["conference"]["conferenceId"]["messages"]["researchService"]["get"]
  >
>["data"];

export default function InboxPageResearchService() {
  const conferenceId = useContext(ConferenceIdContext);
  const { backend } = useBackend();

  const [messages, setMessages] = useState<ChairMessages | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<
    NonNullable<ChairMessages>[number] | null
  >(null);

  async function getMessages() {
    if (!conferenceId) return;
    backend.conference[conferenceId].messages.researchService
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
      <InboxTemplate
        isResearchService
        messages={messages}
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        getMessagesFunction={getMessages}
      />
    </>
  );
}
