import React, { useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend, type BackendInstanceType } from "@/contexts/backend";
import { ScrollPanel } from "primereact/scrollpanel";
import { LargeFlag } from "@/components/flag_templates";
import {
  faCircleQuestion,
  faEnvelope,
  faMicroscope,
  faCircleExclamation,
  faUserCheck,
  faExclamationCircle,
  faEye,
  faEyeSlash,
  faCommentExclamation,
  faPodium,
  faInboxFull,
  faPaperPlane,
  faPrint,
  faTrash,
  faUserTie,
  faUserXmark,
  faMailForward,
  faMailReply,
} from "@fortawesome/pro-solid-svg-icons";
import { Tag } from "primereact/tag";
import PrintMessageDocument from "@/components/inbox/print_message";
import { Toolbar } from "primereact/toolbar";
import Button from "@/components/button";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import SmallInfoCard from "@/components/small_info_card";
import { messageCategoryTranslation } from "@/i18n/translation_utils";
import { useToast } from "@/contexts/toast";
import { $Enums } from "@prisma/generated/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ChairMessages = Awaited<
  ReturnType<
    ReturnType<
      ReturnType<BackendInstanceType["conference"]>["committee"]
    >["messages"]["get"]
  >
>["data"];

export default function MessageDetails({
  isResearchService,
  message,
  getMessagesFunction,
}: {
  isResearchService: boolean;
  message: NonNullable<ChairMessages>[number];
  getMessagesFunction: () => void;
}) {
  const { LL, locale } = useI18nContext();
  const { toastError, showToast } = useToast();
  const { backend } = useBackend();

  const [showPrintDialog, setShowPrintDialog] = useState<boolean>(false);

  const getMessageCategoryIcon = () => {
    switch (message.category) {
      case $Enums.MessageCategory.TO_CHAIR:
        return faInboxFull;
      case $Enums.MessageCategory.GUEST_SPEAKER:
        return faPodium;
      case $Enums.MessageCategory.FACT_CHECK:
        return faCommentExclamation;
      case $Enums.MessageCategory.INFORMATION:
        return faCircleQuestion;
      case $Enums.MessageCategory.GENERAL_SECRETARY:
        return faUserTie;
      case $Enums.MessageCategory.OTHER:
        return faPaperPlane;
    }
  };

  const getMessageCategoryClassNames = () => {
    switch (message.category) {
      case $Enums.MessageCategory.TO_CHAIR:
        return undefined;
      case $Enums.MessageCategory.GUEST_SPEAKER:
        return ["bg-red-500 text-red-500 border-red-500", "bg-red-500"];
      case $Enums.MessageCategory.FACT_CHECK:
        return [
          "bg-secondary-500 text-secondary-400 border-secondary-400",
          "bg-secondary-500",
        ];
      case $Enums.MessageCategory.INFORMATION:
        return [
          "bg-secondary-500 text-secondary-400 border-secondary-400",
          "bg-secondary-500",
        ];
      case $Enums.MessageCategory.GENERAL_SECRETARY:
        return ["bg-red-500 text-red-500 border-red-500", "bg-red-500"];
      case $Enums.MessageCategory.OTHER:
        return undefined;
    }
  };

  const startContent = (
    <div className="flex gap-2">
      <Button
        faIcon={
          message?.status.includes($Enums.MessageStatus.UNREAD)
            ? faEyeSlash
            : faEye
        }
        tooltip={LL.messageBoard.tooltips.UNREAD()}
        tooltipOptions={{ showDelay: 800, hideDelay: 300, position: "bottom" }}
        onClick={async () => {
          if (message.status.includes($Enums.MessageStatus.UNREAD)) {
            await backend.message[message.id].removeStatus
              .post({
                status: "UNREAD",
              })
              .then((res) => {
                if (res.status !== 200)
                  throw new Error(res.error?.message ?? "Unknown error");
                getMessagesFunction();
              })
              .catch((err) => {
                toastError(err);
              });
          } else {
            await backend.message[message.id].setStatus
              .post({
                status: "UNREAD",
              })
              .then((res) => {
                if (res.status !== 200)
                  throw new Error(res.error?.message ?? "Unknown error");
                getMessagesFunction();
              })
              .catch((err) => {
                toastError(err);
              });
          }
          getMessagesFunction();
        }}
      />
      <Button
        faIcon={faExclamationCircle}
        tooltip={LL.messageBoard.tooltips.PRIORITY()}
        tooltipOptions={{ showDelay: 800, hideDelay: 300, position: "bottom" }}
        severity={
          message?.status.includes($Enums.MessageStatus.PRIORITY)
            ? "danger"
            : "info"
        }
        onClick={async () => {
          if (message.status.includes($Enums.MessageStatus.PRIORITY)) {
            await backend.message[message.id].removeStatus
              .post({
                status: "PRIORITY",
              })
              .then((res) => {
                if (res.status !== 200)
                  throw new Error(res.error?.message ?? "Unknown error");
                getMessagesFunction();
              })
              .catch((err) => {
                toastError(err);
              });
          } else {
            await backend.message[message.id].setStatus
              .post({
                status: "PRIORITY",
              })
              .then((res) => {
                if (res.status !== 200)
                  throw new Error(res.error?.message ?? "Unknown error");
                getMessagesFunction();
              })
              .catch((err) => {
                toastError(err);
              });
          }
          getMessagesFunction();
        }}
      />
      <Button
        tooltip={LL.messageBoard.tooltips.ASSIGNED()}
        tooltipOptions={{ showDelay: 800, hideDelay: 300, position: "bottom" }}
        faIcon={
          message?.status.includes($Enums.MessageStatus.ASSIGNED)
            ? faUserXmark
            : faUserCheck
        }
        severity={
          message?.status.includes($Enums.MessageStatus.ASSIGNED)
            ? "success"
            : "info"
        }
        onClick={async () => {
          if (message.status.includes($Enums.MessageStatus.ASSIGNED)) {
            await backend.message[message.id].removeStatus
              .post({
                status: "ASSIGNED",
              })
              .then((res) => {
                if (res.status !== 200)
                  throw new Error(res.error?.message ?? "Unknown error");
                getMessagesFunction();
              })
              .catch((err) => {
                toastError(err);
              });
          } else {
            await backend.message[message.id].setStatus
              .post({
                status: "ASSIGNED",
              })
              .then((res) => {
                if (res.status !== 200)
                  throw new Error(res.error?.message ?? "Unknown error");
                getMessagesFunction();
              })
              .catch((err) => {
                toastError(err);
              });
          }
          getMessagesFunction();
        }}
      />
      <Button
        faIcon={faTrash}
        severity="danger"
        tooltip={LL.messageBoard.tooltips.DELETE()}
        tooltipOptions={{ showDelay: 800, hideDelay: 300, position: "bottom" }}
        onClick={async () => {
          await backend.message[message.id].setStatus
            .post({
              status: "ARCHIVED",
            })
            .then((res) => {
              if (res.status !== 200)
                throw new Error(res.error?.message ?? "Unknown error");
              showToast({
                severity: "warn",
                summary: LL.messageBoard.toast.ARCHIVED_SUMMARY(),
                detail: LL.messageBoard.toast.ARCHIVED_DETAIL(),
              });
              getMessagesFunction();
            })
            .catch((err) => {
              toastError(err);
            });
          getMessagesFunction();
        }}
      />
    </div>
  );

  const centerContent = (
    <div className="flex gap-2">
      <Button
        faIcon={faMailForward}
        label={LL.messageBoard.BUTTON_FORWARD_TO_RESEARCH_SERVICE()}
        severity="warning"
        onClick={async () => {
          await backend.message[message.id].forwardToResearchService
            .post()
            .then((res) => {
              if (res.status !== 200)
                throw new Error(res.error?.message ?? "Unknown error");
              showToast({
                severity: "success",
                summary: LL.messageBoard.toast.FORWARDED_SUMMARY(),
                detail: LL.messageBoard.toast.FORWARDED_DETAIL(),
              });
              getMessagesFunction();
            })
            .catch((err) => {
              toastError(err);
            });
          getMessagesFunction();
        }}
      />
    </div>
  );

  const endContent = (
    <div className="flex gap-2">
      <Button
        faIcon={faPrint}
        onClick={() => setShowPrintDialog(true)}
        tooltip={LL.messageBoard.tooltips.PRINT()}
        tooltipOptions={{ showDelay: 800, hideDelay: 300, position: "bottom" }}
      />
      <Button
        faIcon={faMailReply}
        tooltip={LL.messageBoard.tooltips.REPLY_VIA_EMAIL()}
        tooltipOptions={{ showDelay: 800, hideDelay: 300, position: "bottom" }}
        onClick={() => window.open(`mailto:${message?.metaEmail}`)}
      />
    </div>
  );

  return (
    <ScrollPanel className="h-screen w-full">
      <Toolbar
        className="w-full mb-6"
        start={startContent}
        center={centerContent}
        end={endContent}
      />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center h-8">
          <div className="flex gap-2 items-center">
            {message.status.includes($Enums.MessageStatus.UNREAD) && (
              <Tag
                value={LL.messageBoard.TAG_UNREAD()}
                severity="info"
                className="w-max"
                icon={<FontAwesomeIcon icon={faEnvelope} className="mr-2" />}
              />
            )}
            {message.category !== $Enums.MessageCategory.TO_CHAIR &&
              !isResearchService && (
                <Tag
                  value={LL.messageBoard.TAG_RESEARCH_SERVICE()}
                  severity="warning"
                  className="w-max"
                  icon={
                    <FontAwesomeIcon icon={faMicroscope} className="mr-2" />
                  }
                />
              )}
            {message.status.includes($Enums.MessageStatus.PRIORITY) && (
              <Tag
                value={LL.messageBoard.TAG_PRIORITY()}
                severity="danger"
                className="w-max"
                icon={
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="mr-2"
                  />
                }
              />
            )}
            {message.status.includes($Enums.MessageStatus.ASSIGNED) && (
              <Tag
                value={LL.messageBoard.TAG_ASSIGNED()}
                severity="success"
                className="w-max"
                icon={<FontAwesomeIcon icon={faUserCheck} className="mr-2" />}
              />
            )}
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
        <SmallInfoCard
          //@ts-ignore
          icon={getMessageCategoryIcon()}
          classNameForIconBox={getMessageCategoryClassNames()?.[0]}
          classNameForContentBox={getMessageCategoryClassNames()?.[1]}
          className="font-bold"
        >
          {messageCategoryTranslation(LL, message.category)}
        </SmallInfoCard>

        <h1 className="text-2xl font-bold my-4">{message.subject}</h1>
        <p>{message.message}</p>

        <div className="flex gap-4 items-center p-4 my-4 bg-primary-950 rounded-xl">
          <LargeFlag countryCode={message.metaDelegation ?? "xxx"} />
          <div className="flex-1 flex flex-col">
            <h2 className="text-lg font-bold">
              {getCountryNameByCode(message.metaDelegation, locale)}
            </h2>
            <h2 className="text-md">{message.metaCommittee}</h2>
          </div>
        </div>
      </div>
      <PrintMessageDocument
        message={message}
        showDialog={showPrintDialog}
        setShowDialog={setShowPrintDialog}
      />
    </ScrollPanel>
  );
}
