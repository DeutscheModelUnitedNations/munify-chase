"use client";
import React, { useState, useEffect, useContext } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { ScrollPanel } from "primereact/scrollpanel";
import { Menubar } from "primereact/menubar";
import {
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import { SmallFlag } from "@/components/flag_templates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faInbox,
  faInboxArrowDown,
  faInboxFull,
  faPaperPlane,
  faPrint,
} from "@fortawesome/pro-solid-svg-icons";
import NoDataPlaceholder from "@/components/no_data_placeholder";
import { Tag } from "primereact/tag";

type ChairMessages = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["committee"]["committeeId"]["messages"]["get"]
  >
>["data"];

export default function COMPONENT_TITLE() {
  const { LL, locale } = useI18nContext();
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const [messages, setMessages] = useState<ChairMessages | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  async function getMessages() {
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

  const items = [
    {
      icon: <FontAwesomeIcon icon={faEyeSlash} />,
    },
    {
      icon: <FontAwesomeIcon icon={faInboxFull} />,
    },
    {
      icon: <FontAwesomeIcon icon={faPrint} />,
    },
    {
      icon: <FontAwesomeIcon icon={faPaperPlane} />,
    },
  ];

  return (
    <>
      <div className="flex h-screen w-screen bg-white overflow-hidden">
        <ScrollPanel className="w-1/3 h-full border-r border-gray-200">
          <div className="flex flex-col gap-2 justify-stretch">
            <div className="mx-4 mt-4 flex gap-2 text-2xl items-center">
              <FontAwesomeIcon icon={faInbox} className="text-primary-500" />
              <h1 className="font-bold">Inbox</h1>
            </div>
            {messages?.map((message) => (
              <MessageCard
                message={message}
                setSelected={setSelectedMessage}
                selected={selectedMessage === message.id}
              />
            ))}
          </div>
        </ScrollPanel>
        <div className="w-2/3 h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Menubar model={items} className="w-full" />
          </div>
          <div className="p-4">
            {selectedMessage ? (
              <MessageDetails
                message={messages?.find((m) => m.id === selectedMessage)}
              />
            ) : (
              <div className="h-screen w-full flex justify-center items-center">
                <NoDataPlaceholder
                  title={LL.messageBoard.NO_MESSAGE_SELECTED()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function MessageCard({
  message,
  selected,
  setSelected,
}: {
  message: ChairMessages[number];
  selected?: boolean;
  setSelected: (id: string) => void;
}) {
  const { LL } = useI18nContext();

  return (
    <div
      key={message.id}
      className={`p-4 m-2 flex flex-col justify-start rounded-md ${
        selected
          ? "bg-primary-500 text-white"
          : "bg-primary-950 text-black hover:bg-primary-900 hover:cursor-pointer"
      } hover:scale-[1.01] transition-all duration-300`}
      onClick={() => setSelected(message.id)}
      onKeyUp={() => setSelected(message.id)}
    >
      <div className="w-full mb-2 flex justify-between items-center gap-2">
        <Tag
          value={LL.messageBoard.TAG_UNREAD()}
          severity="info"
          className="w-max"
        />
        <div className="flex-1" />
        <h3 className="text-sm truncate">
          {new Date(message.timestamp).toLocaleTimeString()}{" "}
          {new Date(message.timestamp).toLocaleDateString()}
        </h3>
      </div>
      <div className="flex gap-2 p-2 bg-white rounded-md mb-2 items-center">
        <div className="w-max">
          <SmallFlag countryCode={message.metaDelegation} />
        </div>
        <h3 className="text-black text-sm truncate">{message.metaCommittee}</h3>
      </div>
      <h2 className="text-lg font-bold">{message.subject}</h2>
      <p className="text-sm truncate">{message.message}</p>
    </div>
  );
}

function MessageDetails({
  message,
}: {
  message: ChairMessages[number];
}) {
  return (
    <ScrollPanel className="h-full w-full">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">{message.subject}</h1>
          <Tag value="Unread" severity="info" className="w-max" />
        </div>
        <div className="flex gap-2 items-center">
          <SmallFlag countryCode={message.metaDelegation} />
          <h2>{message.metaCommittee}</h2>
        </div>
        <p>{message.message}</p>
      </div>
    </ScrollPanel>
  );
}
