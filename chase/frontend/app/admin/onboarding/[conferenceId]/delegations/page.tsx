"use client";
import React from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";

export default function loginVorsitz() {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const router = useRouter();

  return (
    <>
      <OnboardingSteps activeIndex={3} />
    </>
  );
}
