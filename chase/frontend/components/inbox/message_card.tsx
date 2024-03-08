import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend, type BackendInstanceType } from "@/contexts/backend";
import { SmallFlag } from "@/components/flag_templates";
import { Tag } from "primereact/tag";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { useToast } from "@/contexts/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { $Enums } from "../../../backend/prisma/generated/client";
import {
  faCircleExclamation,
  faEnvelope,
  faMicroscope,
  faUserCheck,
} from "@fortawesome/pro-solid-svg-icons";

type ChairMessages = Awaited<
  ReturnType<
    BackendInstanceType["conference"]["conferenceId"]["committee"]["committeeId"]["messages"]["get"]
  >
>["data"];

export default function MessageCard({
  isResearchService,
  message,
  selected,
  setSelected,
  getMessagesFunction,
}: {
  isResearchService: boolean;
  message: NonNullable<ChairMessages>[number];
  selected?: boolean;
  setSelected: (message: NonNullable<ChairMessages>[number]) => void;
  getMessagesFunction: () => void;
}) {
  const { locale } = useI18nContext();
  const { toastError } = useToast();
  const { backend } = useBackend();

  async function selectMessage() {
    setSelected(message);
    if (message.status.includes($Enums.MessageStatus.UNREAD)) {
      await backend.message[message.id].removeStatus
        .post({
          status: "UNREAD",
        })
        .then((res) => {
          if (res.status !== 200)
            throw new Error(res.error?.message ?? "Unknown error");
        })
        .catch((err) => {
          toastError(err);
        });
      getMessagesFunction();
    }
  }

  return (
    <div
      key={message.id}
      className={`p-4 mx-2 flex flex-col justify-start rounded-md ${
        selected
          ? "bg-primary-500 text-white"
          : "bg-primary-950 text-black hover:bg-primary-900 hover:cursor-pointer"
      } hover:scale-[1.01] transition-all duration-300`}
      onClick={() => selectMessage()}
      onKeyUp={() => selectMessage()}
    >
      <div className="w-full mb-2 flex justify-between items-center gap-2 h-8">
        {message.status.includes($Enums.MessageStatus.UNREAD) && (
          <Tag
            severity="info"
            className="h-7 w-8"
            icon={<FontAwesomeIcon icon={faEnvelope} />}
          />
        )}
        {message.category !== $Enums.MessageCategory.TO_CHAIR &&
          !isResearchService && (
            <Tag
              severity="warning"
              className="h-7 w-8"
              icon={<FontAwesomeIcon icon={faMicroscope} />}
            />
          )}
        {message.status.includes($Enums.MessageStatus.PRIORITY) && (
          <Tag
            severity="danger"
            className="h-7 w-8"
            icon={<FontAwesomeIcon icon={faCircleExclamation} />}
          />
        )}
        {message.status.includes($Enums.MessageStatus.ASSIGNED) && (
          <Tag
            severity="success"
            className="h-7 w-8"
            icon={<FontAwesomeIcon icon={faUserCheck} />}
          />
        )}
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
      <h2 className="text-lg font-bold">{message.subject}</h2>
      <p className="text-sm truncate">{message.message}</p>
      <div
        className={`flex gap-2 p-2 ${
          selected ? "bg-primary-700" : "bg-white"
        } rounded-md mt-4 items-center tramsition-all duration-300`}
      >
        <div className="w-max">
          <SmallFlag countryCode={message.metaDelegation ?? "xxx"} />
        </div>
        <h3 className="text-black font-bold text-sm truncate">
          {getCountryNameByCode(message.metaDelegation, locale ?? "de-de")} /{" "}
          {message.metaCommittee}
        </h3>
      </div>
    </div>
  );
}
