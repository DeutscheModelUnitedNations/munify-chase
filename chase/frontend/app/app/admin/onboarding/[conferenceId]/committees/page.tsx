"use client";
import React, { useContext, useEffect, useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend, type BackendInstanceType } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import { Accordion, AccordionTab } from "primereact/accordion";
import AgendaItems from "@/components/admin/committee/agendaItems";
import {
  CommitteeIdContext,
  ConferenceIdContext,
} from "@/contexts/committee_data";
import { useToast } from "@/contexts/toast";

type CommitteesType = Awaited<
  ReturnType<
    BackendInstanceType["conference"]["conferenceId"]["committee"]["get"]
  >
>["data"];

export default function OnboardingCommitteePage() {
  const router = useRouter();
  const { toastError } = useToast();
  const conferenceId = useContext(ConferenceIdContext);
  const { backend } = useBackend();

  const [saveLoading, setSaveLoading] = useState(false);
  const [committees, setCommittees] = useState<CommitteesType | null>(null);

  const [update, setUpdate] = useState(true);

  async function getCommittees() {
    if (!conferenceId) return;
    await backend.conference[conferenceId].committee
      .get()
      .then((res) => {
        if (res.status > 400 || !res.data)
          throw new Error("Failed to fetch committees");
        setCommittees(res.data);
      })
      .catch((e) => {
        toastError(e);
      });
  }

  useEffect(() => {
    if (update) {
      getCommittees();

      setUpdate(false);
    }
  }, [update]);

  const handleSave = () => {
    setSaveLoading(true);
    router.push(`/app/admin/onboarding/${conferenceId}/delegations`);
  };

  return (
    <>
      <OnboardingSteps activeIndex={2} />

      <Accordion activeIndex={0} className="w-full">
        {committees?.map((committee) => (
          <AccordionTab header={HeaderTemplate(committee)} key={committee?.id}>
            <CommitteeIdContext.Provider value={committee.id}>
              <AgendaItems />
            </CommitteeIdContext.Provider>
          </AccordionTab>
        ))}
      </Accordion>

      <ForwardBackButtons
        backURL={`/app/admin/onboarding/${conferenceId}/teampool`}
        handleSaveFunction={handleSave}
        saveLoading={saveLoading}
        forwardDisabled={false}
      />
    </>
  );
}

const HeaderTemplate = (committee: NonNullable<CommitteesType>[number]) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <h2 className="font-bold text-lg">
        {committee.name} ({committee.abbreviation})
      </h2>
    </div>
  );
};
