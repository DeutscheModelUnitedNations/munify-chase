"use client";
import React, { useEffect, useRef, useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Chip } from "primereact/chip";
import { Toast } from "primereact/toast";

import { ChairMultiSelect, AdvisorMultiSelect } from "@/components/admin/committee/multiselect";

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
  const [committees, setCommittees] = useState([]);

  const [chairs, setChairs] = useState([]);
  const [advisors, setAdvisors] = useState([]);

  const [update, setUpdate] = useState(true);

  useEffect(() => {
    backend.conference[params.conferenceId].committee.list
      .get()
      .then((res) => {
        console.log(res.data);
        setCommittees(res.data);
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });

    backend.conference[params.conferenceId].team.chairs.list
      .get()
      .then((res) => {
        console.log(res.data);
        setChairs(res.data);
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });

    setUpdate(false);
  }, [update]);

  const handleSave = () => {
    setSaveLoading(true);
    router.push(`/admin/onboarding/${params.conferenceId}/delegations`);
  };

  return (
    <>
      <OnboardingSteps activeIndex={2} />

      <Accordion activeIndex={[0, 1]} className="w-full">
        {committees.map((committee) => (
          <AccordionTab header={HeaderTemplate(committee)} key={committee.id}>
            <ChairMultiSelect
              committee={committee}
              chairs={chairs}
            />
            <AdvisorMultiSelect
              committee={committee}
              advisors={advisors}
            />
          </AccordionTab>
        ))}
      </Accordion>

      <ForwardBackButtons
        backURL={`/admin/onboarding/${params.conferenceId}/teampool`}
        handleSaveFunction={handleSave}
        saveLoading={saveLoading}
        forwardDisabled={false}
      />
    </>
  );
}

const HeaderTemplate = (committee: { name: string; abbreviation: string }) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <h2 className="font-bold text-lg">
        {committee.name} ({committee.abbreviation})
      </h2>
      <div className="flex gap-2">
        {committee.chairs?.map((chair) => (
          <Chip
            label={`${chair.firstName} ${chair.lastName}`}
            key={chair.id}
            className="p-mr-2"
          />
        ))}
      </div>
    </div>
  );
};
