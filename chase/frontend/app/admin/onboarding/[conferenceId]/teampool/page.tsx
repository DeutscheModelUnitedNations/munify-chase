"use client";
import React, { useEffect, useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import TeamPoolTable from "@/components/admin/teampool/teampool_table";
import AddTeammemberDialog from "@/components/admin/teampool/add_teammember_dialog";
import { confirmPopup } from "primereact/confirmpopup";
import {
  CreateTeammemberPayload,
  TeamRoles,
  Teammember,
} from "@/custom_types/fetching";

export default function teampool({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const router = useRouter();

  const [team, setTeam] = useState<Awaited<ReturnType<typeof getTeam>>>([]);
  const [inputMaskVisible, setInputMaskVisible] = useState(false);
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);
  const [updateTable, setUpdateTable] = useState(true);

  const [saveLoading, setSaveLoading] = useState(false);

  async function getTeam() {
    try {
      const res = await backend.conference[params.conferenceId].team.list.get();
      return res.data;
    } catch (error) {
      Toast.current.show({
        severity: "error",
        summary: LL.admin.onboarding.error.title(),
        detail: LL.admin.onboarding.error.generic(),
      });
    }
  }

  useEffect(() => {
    if (updateTable) {
      getTeam().then((data) => {
        setTeam(data);
      });
      setUpdateTable(false);
    }
  }, [updateTable]);

  const addTeammember = ({
    firstName,
    lastName,
    email,
    role
  }: CreateTeammemberPayload) => {
    backend.conference[params.conferenceId].team
      .post({
        firstName,
        lastName,
        email,
        role,
      })
      .then((_res) => {
        setUpdateTable(true);
      })
      .catch((_err) => {
        toast.current.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  };

  const confirmDeleteAll = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: LL.admin.onboarding.structure.DELETE_ALL_CONFIRM(),
      acceptClassName: "p-button-danger",
      accept: () => {
        backend.conference[params.conferenceId].team
          .delete()
          .then(() => {
            setUpdateTable(true);
          })
          .catch((err) => {
            toast.current.show({
              severity: "error",
              summary: LL.admin.onboarding.error.title(),
              detail: LL.admin.onboarding.error.generic(),
            });
          });
      },
    });
  };

  const handleDelete = (rawData: Teammember) => {
    // backend["conference/committee/delete"]
    backend.conference[params.conferenceId].team[rawData.id]
      .delete()
      .then((_res) => {
        setUpdateTable(true);
      })
      .catch((_err) => {
        toast.current.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  };

  const handleSave = () => {
    setSaveLoading(true);
    router.push(`/admin/onboarding/${params.conferenceId}/committees`);
  };

  return (
    <>
      <OnboardingSteps activeIndex={1} />
      <TeamPoolTable
        team={team}
        confirmDeleteAll={confirmDeleteAll}
        handleDelete={handleDelete}
        setInputMaskVisible={setInputMaskVisible}
        setUploadDialogVisible={setUploadDialogVisible}
      />

      <ForwardBackButtons
        backURL={`/admin/onboarding/${params.conferenceId}/structure`}
        saveLoading={saveLoading}
        handleSaveFunction={handleSave}
        forwardDisabled={
          team?.length === 0 ||
          team?.filter((teammember) => teammember.role === "CHAIR").length ===
            0 ||
          team?.filter((teammember) => teammember.role === "ADMIN").length === 0
        }
      />

      <AddTeammemberDialog
        inputMaskVisible={inputMaskVisible}
        setInputMaskVisible={setInputMaskVisible}
        addTeammemberToList={addTeammember}
      />
    </>
  );
}
