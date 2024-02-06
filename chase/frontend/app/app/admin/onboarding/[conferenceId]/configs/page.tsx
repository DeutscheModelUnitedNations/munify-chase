"use client";
import React from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";

export default function loginVorsitz({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const router = useRouter();

  return (
    <>
      <OnboardingSteps activeIndex={5} />

      <ForwardBackButtons
        backURL={`/app/admin/onboarding/${params.conferenceId}/non_state_actors`}
        handleSaveFunction={() => {
          router.push(
            `/app/admin/${params.conferenceId}/dashboard`
          );
        }}
      />
    </>
  );
}
