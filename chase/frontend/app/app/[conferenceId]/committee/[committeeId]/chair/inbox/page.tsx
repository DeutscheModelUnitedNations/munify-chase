"use client";
import React, { useState, useEffect, useContext } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import {
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import InboxTemplate from "@/components/inbox/inbox_template";

type ChairMessages = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["committee"]["committeeId"]["messages"]["get"]
  >
>["data"];

export default function InboxPage() {
  const { LL, locale } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const [messages, setMessages] = useState<ChairMessages | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<
    NonNullable<ChairMessages>[number] | null
  >(null);

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
      <InboxTemplate
        isResearchService={false}
        messages={messages}
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        getMessagesFunction={getMessages}
      />
    </>
  );
}
