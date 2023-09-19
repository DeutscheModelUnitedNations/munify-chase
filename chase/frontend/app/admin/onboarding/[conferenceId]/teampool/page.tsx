"use client";
import React, { useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import TeamPoolTable from "@/components/admin/teampool/teampool_table";
import { confirmPopup } from "primereact/confirmpopup";

export default function teampool({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const router = useRouter();

  const [team, setTeam] = useState<TeamEntry[]>([]);
  const [inputMaskVisible, setInputMaskVisible] = useState(false);
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const confirmDeleteAll = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: LL.admin.onboarding.structure.DELETE_ALL_CONFIRM(),
      acceptClassName: "p-button-danger",
      accept: () => {
        setTeam([]);
      },
    });
  };

  return (
    <>
      <OnboardingSteps activeIndex={1} />
      <TeamPoolTable
        team={team}
        confirmDeleteAll={confirmDeleteAll}
        handleDelete={(teammember) => {
          setTeam(team.filter((t) => t.id !== teammember.id));
        }}
        setInputMaskVisible={setInputMaskVisible}
        setUploadDialogVisible={setUploadDialogVisible}
      />
      <ForwardBackButtons
        backURL={`/admin/onboarding/${params.conferenceId}/structure`}
        saveLoading={saveLoading}
        handleSaveFunction={() => {}}
        forwardDisabled={team.length === 0}
      />
    </>
  );
}
