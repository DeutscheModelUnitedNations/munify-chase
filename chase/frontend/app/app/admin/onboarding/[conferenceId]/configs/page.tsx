"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import ConfigWrapper from "@/components/dashboard/chair/config_wrapper";
import { InputText } from "primereact/inputtext";

export default function loginVorsitz({
  params,
}: {
  params: { conferenceId: string };
}) {
  const router = useRouter();

  const [pressURL, setPressURL] = useState<string>("");

  function checkURL(url: string) {
    return url.match(/https?:\/\/.+/);
  }

  return (
    <>
      <OnboardingSteps activeIndex={5} />

      <ConfigWrapper
        title="Pressewebsite"
        description="Hier kannst du die URL der Pressewebsite konfigurieren."
        // TODO implement press website change fully
      >
        <InputText
          placeholder="URL der Pressewebsite"
          value={pressURL}
          onFocus={(e) => {
            if (e.target.value === "") {
              setPressURL("https://");
            }
          }}
          onChange={(e) => setPressURL(e.target.value)}
          className="w-full"
          disabled
        />
      </ConfigWrapper>

      <ForwardBackButtons
        backURL={`/app/admin/onboarding/${params.conferenceId}/non_state_actors`}
        handleSaveFunction={() => {
          router.push(`/app/${params.conferenceId}/hub/team/committees`);
        }}
      />
    </>
  );
}
