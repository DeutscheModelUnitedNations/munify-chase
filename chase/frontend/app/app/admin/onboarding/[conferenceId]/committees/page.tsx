"use client";
import React, { useEffect, useRef, useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";

import {
  ChairMultiSelect,
  AdvisorMultiSelect,
} from "@/components/admin/committee/multiselect";
import AgendaItems from "@/components/admin/committee/agendaItems";
import { Committee, Teammember } from "@/custom_types/fetching";

export default function loginVorsitz({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [committees, setCommittees] = useState<
    Awaited<ReturnType<typeof getCommittees>>
  >([]);

  const [chairs, setChairs] = useState<Awaited<ReturnType<typeof getChairs>>>(
    []
  );
  const [advisors, setAdvisors] = useState<
    Awaited<ReturnType<typeof getAdvisors>>
  >([]);
  const [agendaItems, setAgendaItems] = useState<
    Awaited<ReturnType<typeof getAgendaItems>>
  >([]);

  const [update, setUpdate] = useState(true);

  async function getCommittees(id: string) {
    const res = await backend.conference[id].committee.list
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

  async function getChairs(id: string) {
    const res = await backend.conference[id].team.chairs.list
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

  async function getAdvisors(id: string) {
    const res = await backend.conference[id].team.advisors.list
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

  async function getAgendaItems(id: string) {
    const res = await backend.conference[id].agendaItem.list
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

  useEffect(() => {
    if (update) {
      getCommittees(params.conferenceId).then((data) => {
        setCommittees(data);
      });
      getChairs(params.conferenceId).then((data) => {
        setChairs(data);
      });
      getAdvisors(params.conferenceId).then((data) => {
        setAdvisors(data);
      });
      getAgendaItems(params.conferenceId).then((data) => {
        setAgendaItems(data);
      });
      setUpdate(false);
    }
  }, [update]);

  const handleSave = () => {
    setSaveLoading(true);
    router.push(`/admin/onboarding/${params.conferenceId}/delegations`);
  };

  return (
    <>
      <OnboardingSteps activeIndex={2} />

      <Accordion activeIndex={0} className="w-full">
        {committees?.map((committee) => (
          <AccordionTab
            header={HeaderTemplate(committee, chairs, advisors)}
            key={committee.id}
          >
            <ChairMultiSelect
              conferenceId={params.conferenceId}
              committee={committee}
              teammember={chairs}
              setUpdate={setUpdate}
            />
            <AdvisorMultiSelect
              conferenceId={params.conferenceId}
              committee={committee}
              teammember={advisors}
              setUpdate={setUpdate}
            />
            <AgendaItems
              conferenceId={params.conferenceId}
              committeeId={committee.id}
              agendaItems={agendaItems}
              setUpdate={setUpdate}
            />
          </AccordionTab>
        ))}
      </Accordion>

      <ForwardBackButtons
        backURL={`/app/admin/onboarding/${params.conferenceId}/teampool`}
        handleSaveFunction={handleSave}
        saveLoading={saveLoading}
        forwardDisabled={false}
      />
    </>
  );
}

const HeaderTemplate = (
  committee: Committee,
  chairs: Teammember[] | null | undefined,
  advisors: Teammember[] | null | undefined
) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <h2 className="font-bold text-lg">
        {committee.name} ({committee.abbreviation})
      </h2>
      <div className="flex gap-2">
        {chairs
          ?.filter((chair) => chair.chair_committeeId === committee.id)
          .map((chair) => (
            <div
              key={`${chair.id}-chip`}
              className="flex justify-center items-center bg-primary-500 text-white py-2 px-3 rounded-md font-normal"
            >
              {chair.firstName.charAt(0)}
              {chair.lastName.charAt(0)}
            </div>
          ))}
        {advisors
          ?.filter((advisor) => advisor.advisor_committeeId === committee.id)
          .map((advisor) => (
            <div
              key={`${advisor.id}-chip`}
              className="flex justify-center items-center bg-secondary-500 text-white py-2 px-3 rounded-md font-normal"
            >
              {advisor.firstName.charAt(0)}
              {advisor.lastName.charAt(0)}
            </div>
          ))}
      </div>
    </div>
  );
};
