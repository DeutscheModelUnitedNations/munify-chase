import React, { useEffect, useRef, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { InputText } from "primereact/inputtext";
import Button from "@/components/button";
import {
  faPlusCircle,
  faPodium,
  faTrashAlt,
} from "@fortawesome/pro-solid-svg-icons";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AgendaItem } from "../../../../backend/prisma/generated/client";

interface AgendaItemProbs {
  conferenceId: string;
  committeeId: string;
  setUpdate: (update: boolean) => void;
}

export default function agendaItem({
  conferenceId,
  committeeId,
}: AgendaItemProbs) {
  const { LL } = useI18nContext();
  const toast = useRef<Toast>(null);

  const [committeeAgendaItems, setCommitteeAgendaItems] = useState<
    AgendaItem[]
  >([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [update, setUpdate] = useState<Boolean>(true);

  useEffect(() => {
    if (update) {
      getAgendaItems(conferenceId, committeeId).then((data) => {
        setCommitteeAgendaItems(data);
      });
      
      setUpdate(false);
    }
  }, [update]);

  async function getAgendaItems(conferenceId: string, committeeId: string): Promise<AgendaItem[]> {
    const res = await backend.conference[conferenceId].committee[committeeId].agendaItem
      .get()
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
    return res.data;
  }

  async function addAgendaItem() {
    try {
      await backend.conference[conferenceId].committee[committeeId].agendaItem.post({
        title: inputValue,
      });
      setUpdate(true);
      setInputValue("");
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: LL.admin.onboarding.error.title(),
        detail: LL.admin.onboarding.error.generic(),
      });
    }
  }

  async function deleteAgendaItem(agendaItemId: string) {
    try {
      await backend.conference[conferenceId].committee[committeeId].agendaItem[
        agendaItemId
      ].delete();
      setUpdate(true);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: LL.admin.onboarding.error.title(),
        detail: LL.admin.onboarding.error.generic(),
      });
    }
  }

  return (
    <>
      <h1 className="font-bold text-lg mb-4">{LL.admin.onboarding.committees.AGENDA_ITEMS()}</h1>
      <li className="flex flex-col gap-2 mb-4">
        {committeeAgendaItems.map((item) => (
          <ul className="flex justify-between items-center bg-gray-100 rounded-md p-1" key={item.id}>
            <div className="mx-4"><FontAwesomeIcon icon={faPodium} className="text-primary-500" /></div>
            <div className="flex-1 my-1">{item.title}</div>
            <Button
              faIcon={faTrashAlt}
              severity="danger"
              text
              onClick={() => deleteAgendaItem(item.id)}
              size="small"
            />
          </ul>
        ))}
      </li>
      <div className="flex gap-2">
        <InputText
          id="username"
          placeholder={LL.admin.onboarding.committees.ADD_AGENDA_ITEM()}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mt-3 flex-1"
        />
        <Button
          faIcon={faPlusCircle}
          label={LL.admin.onboarding.committees.ADD_ITEM_BUTTON()}
          onClick={() => addAgendaItem()}
          disabled={inputValue === ""}
        />
      </div>
    </>
  );
}
