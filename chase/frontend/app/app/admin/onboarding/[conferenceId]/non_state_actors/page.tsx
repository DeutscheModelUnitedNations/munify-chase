"use client";
import React from "react";

import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";

export default function loginVorsitz({
  params,
}: {
  params: { conferenceId: string };
}) {
  const router = useRouter();

  return (
    <>
      <OnboardingSteps activeIndex={4} />

      <ForwardBackButtons
        backURL={`/app/admin/onboarding/${params.conferenceId}/delegations`}
        handleSaveFunction={() => {
          router.push(`/app/admin/onboarding/${params.conferenceId}/configs`);
        }}
      />
    </>
  );
}
