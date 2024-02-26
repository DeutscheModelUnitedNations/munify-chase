import React, { useState, useEffect, useContext } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import ConfigWrapper from "@/components/dashboard/chair/config_wrapper";
import { Dropdown } from "primereact/dropdown";
import Button from "@/components/button";
import { faPencil } from "@fortawesome/pro-solid-svg-icons";
import {
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import { useToast } from "@/contexts/toast";
type AgendaItems = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["committee"]["committeeId"]["agendaItem"]["get"]
  >
>["data"];

export default function AgendaSelection() {
  const { LL } = useI18nContext();
  const { showToast, toastError } = useToast();
  const conferenceId = useContext(ConferenceIdContext);
  const committeeId = useContext(CommitteeIdContext);

  const [agendaItems, setAgendaItems] = useState<AgendaItems | null>(null);

  async function getAgendaItems() {
    if (!conferenceId || !committeeId) return;
    await backend.conference[conferenceId].committee[committeeId].agendaItem
      .get()
      .then((response) => {
        setAgendaItems(response.data);
      })
      .catch((error) => {
        toastError(error);
      });
  }

  useEffect(() => {
    getAgendaItems();
    const intervalAPICall = setInterval(() => {
      getAgendaItems();
    }, 5000);
    return () => clearInterval(intervalAPICall);
  }, []);

  async function activateAgendaItem(agendaItemId: string) {
    if (!conferenceId || !committeeId) return;
    await backend.conference[conferenceId].committee[committeeId].agendaItem[
      agendaItemId
    ].activate
      .post()
      .then((res) => {
        if (res.status === 200) {
          getAgendaItems();
          showToast({
            severity: "success",
            summary: LL.chairs.dashboard.configurations.agenda.TOAST_SUCCESS(),
            detail: agendaItems?.find((item) => item.id === agendaItemId)
              ?.title,
          });
        } else {
          throw new Error("Failed to activate agenda item");
        }
      })
      .catch((error) => {
        toastError(error);
      });
  }

  return (
    <>
      <ConfigWrapper
        title={LL.chairs.dashboard.configurations.agenda.TITLE()}
        description={LL.chairs.dashboard.configurations.agenda.DESCRIPTION()}
      >
        <div className="flex gap-2 w-full">
          {/* <Button
            faIcon={faPencil}
            onClick={() => {
              // TODO Implement Chairs creating new Agenda Items
              alert("Not implemented yet");
            }}
            disabled
          /> */}
          <Dropdown
            value={agendaItems?.find((item) => item.isActive)?.id || null}
            options={
              agendaItems?.map((item) => ({
                label: item.title,
                value: item.id,
              })) ?? []
            }
            onChange={(e) => activateAgendaItem(e.value)}
            placeholder={LL.chairs.dashboard.configurations.agenda.PLACEHOLDER()}
            loading={!agendaItems}
            className="w-full"
          />
        </div>
      </ConfigWrapper>
    </>
  );
}
