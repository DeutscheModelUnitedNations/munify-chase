"use client";
import React, { useEffect, useRef, useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
import AgendaItems from "@/components/admin/committee/agendaItems";
import { Committee } from "../../../../../../../backend/prisma/generated/client";

export default function loginVorsitz({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [committees, setCommittees] = useState<Committee[]>([]);

  const [update, setUpdate] = useState(true);

  async function getCommittees(conferenceId: string): Promise<Committee[]> {
    const res = await backend.conference[conferenceId].committee
      .get()
      .catch((error) => {
        console.error(error);
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
      getCommittees(params.conferenceId).then((committeeData) => {
        setCommittees(committeeData);
      });

      setUpdate(false);
    }
  }, [update]);

  const handleSave = () => {
    setSaveLoading(true);
    router.push(`/app/admin/onboarding/${params.conferenceId}/delegations`);
  };

  return (
    <>
      <OnboardingSteps activeIndex={2} />

      <Accordion activeIndex={0} className="w-full">
        {committees?.map((committee) => (
          <AccordionTab header={HeaderTemplate(committee)} key={committee.id}>
            <AgendaItems
              conferenceId={params.conferenceId}
              committeeId={committee.id}
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

const HeaderTemplate = (committee: Committee) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <h2 className="font-bold text-lg">
        {committee.name} ({committee.abbreviation})
      </h2>
    </div>
  );
};
