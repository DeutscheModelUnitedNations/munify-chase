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
import { LargeFlag, NormalFlag, SmallFlag } from "@/components/flag_templates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faEye,
  faEyeSlash,
  faInbox,
  faInboxFull,
  faPaperPlane,
  faPrint,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import NoDataPlaceholder from "@/components/no_data_placeholder";
import { Tag } from "primereact/tag";
import PrintMessageDocument from "@/components/inbox/print_message";
import { Toolbar } from "primereact/toolbar";
import Button from "@/components/button";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { $Enums } from "../../../../../../../../backend/prisma/generated/client";

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
    ChairMessages[number] | null
  >(null);

  const [showPrintDialog, setShowPrintDialog] = useState<boolean>(false);

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

  const startContent = (
    <div className="flex gap-2">
      {selectedMessage?.status === $Enums.MessageStatus.UNREAD ? (
        <Button faIcon={faEyeSlash} />
      ) : (
        <Button faIcon={faEye} />
      )}
      <Button
        faIcon={faExclamationCircle}
        severity={
          selectedMessage?.status === $Enums.MessageStatus.PRIORITY
            ? "warn"
            : "info"
        }
      />
      <Button faIcon={faTrash} severity="error" />
    </div>
  );

  const endContent = (
    <div className="flex gap-2">
      <Button faIcon={faPrint} onClick={() => setShowPrintDialog(true)} />
      <Button
        faIcon={faPaperPlane}
        onClick={() => window.open(`mailto:${messages?.metaEmail}`)}
      />
    </div>
  );

  return (
    <>
      <div className="flex h-screen w-screen bg-white overflow-hidden">
        <div className="w-1/3 h-full border-r border-gray-200">
          <div className="flex flex-col justify-stretch">
            <div className="p-4 flex gap-3 text-2xl items-center border-b border-gray-200">
              <FontAwesomeIcon icon={faInbox} className="text-primary-500" />
              <h1 className="font-bold">Inbox</h1>
            </div>
            <ScrollPanel style={{ width: "100%", height: "90vh" }}>
              <div className="h-full flex flex-col gap-2 pt-2 pb-10">
                {messages?.map((message) => (
                  <MessageCard
                    message={message}
                    setSelected={setSelectedMessage}
                    selected={selectedMessage?.id === message.id}
                    class="h-min"
                  />
                ))}
              </div>
            </ScrollPanel>
          </div>
        </div>
        <div className="w-2/3 h-full">
          {selectedMessage ? (
            <>
              <div className="flex justify-between items-center p-4">
                <Toolbar
                  className="w-full"
                  start={startContent}
                  end={endContent}
                />
              </div>
              <div className="p-4">
                <MessageDetails message={selectedMessage} />
                <PrintMessageDocument
                  message={selectedMessage}
                  showDialog={showPrintDialog}
                  setShowDialog={setShowPrintDialog}
                />
              </div>
            </>
          ) : (
            <div className="h-screen w-full flex justify-center items-center">
              <NoDataPlaceholder
                title={LL.messageBoard.NO_MESSAGE_SELECTED()}
              />
            </div>
          )}
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
  const { LL, locale } = useI18nContext();

  return (
    <div
      key={message.id}
      className={`p-4 mx-2 flex flex-col justify-start rounded-md ${
        selected
          ? "bg-primary-500 text-white"
          : "bg-primary-950 text-black hover:bg-primary-900 hover:cursor-pointer"
      } hover:scale-[1.01] transition-all duration-300`}
      onClick={() => setSelected(message)}
      onKeyUp={() => setSelected(message)}
    >
      <div className="w-full mb-2 flex justify-between items-center gap-2">
        <Tag
          value={LL.messageBoard.TAG_UNREAD()}
          severity="info"
          className="w-max"
        />
        <Tag
          value={LL.messageBoard.TAG_PRIORITY()}
          severity="warning"
          className="w-max"
        />
        <div className="flex-1" />
        <h3 className="text-sm truncate">
          {new Date(message.timestamp).toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          {new Date(message.timestamp).getDay() !== new Date().getDay() &&
            `(${new Date(message.timestamp).toLocaleDateString(locale, {
              month: "numeric",
              day: "numeric",
            })})`}
        </h3>
      </div>
      <div
        className={`flex gap-2 p-2 ${
          selected ? "bg-primary-700" : "bg-white"
        } rounded-md mb-2 items-center tramsition-all duration-300`}
      >
        <div className="w-max">
          <SmallFlag countryCode={message.metaDelegation} />
        </div>
        <h3 className="text-black text-sm truncate">
          {getCountryNameByCode(message.metaDelegation, locale ?? "de-de")} /{" "}
          {message.metaCommittee}
        </h3>
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
  const { LL, locale } = useI18nContext();

  return (
    <ScrollPanel className="h-full w-full">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Tag
              value={LL.messageBoard.TAG_UNREAD()}
              severity="info"
              className="w-max"
            />
            <Tag
              value={LL.messageBoard.TAG_PRIORITY()}
              severity="warning"
              className="w-max"
            />
          </div>
          <h3 className="text-md truncate">
            {LL.messageBoard.TIME({
              date: new Date(message.timestamp).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              time: new Date(message.timestamp).toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })}
          </h3>
        </div>
        <h1 className="text-2xl font-bold my-4">{message.subject}</h1>
        <div className="flex gap-4 items-center p-4 mb-4 bg-primary-950 rounded-xl">
          <LargeFlag countryCode={message.metaDelegation} />
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-bold">
              {getCountryNameByCode(message.metaDelegation, locale)}
            </h2>
            <h2 className="text-md">{message.metaCommittee}</h2>
          </div>
        </div>
        <p>{message.message}</p>
      </div>
    </ScrollPanel>
  );
}
