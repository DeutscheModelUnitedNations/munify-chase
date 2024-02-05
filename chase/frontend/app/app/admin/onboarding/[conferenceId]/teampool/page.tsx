"use client";
import React, { useEffect, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import TeamPoolTable from "@/components/admin/teampool/teampool_table";
import AddTeammemberDialog from "@/components/admin/teampool/add_teammember_dialog";
import { confirmPopup } from "primereact/confirmpopup";
import { ConferenceMember, ConferenceRole } from "../../../../../../../backend/prisma/generated/client";

export default function Teampool({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const router = useRouter();

  const [team, setTeam] = useState<Awaited<ReturnType<typeof getTeam>>>([]);
  const [inputMaskVisible, setInputMaskVisible] = useState(false);
  const [updateTable, setUpdateTable] = useState(true);

  const [saveLoading, setSaveLoading] = useState(false);

  async function getTeam() {
    try {
      const res = await backend.conference[params.conferenceId].member.get();
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
    role,
    count
  }: { role: ConferenceRole, count: Number }) => {
    backend.conference[params.conferenceId].member
      .post({
        data: {
          role
        },
        count
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
        backend.conference[params.conferenceId].member
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

  const handleDelete = (id: String) => {
    // backend["conference/committee/delete"]
    backend.conference[params.conferenceId].member[id]
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
    router.push(`/app/admin/onboarding/${params.conferenceId}/committees`);
  };

  return (
    <>
      <OnboardingSteps activeIndex={1} />
      <TeamPoolTable
        team={team}
        confirmDeleteAll={confirmDeleteAll}
        handleDelete={handleDelete}
        handleAdd={addTeammember}
        setInputMaskVisible={setInputMaskVisible}
      />

      <ForwardBackButtons
        backURL={`/app/admin/onboarding/${params.conferenceId}/structure`}
        saveLoading={saveLoading}
        handleSaveFunction={handleSave}
      />

      <AddTeammemberDialog
        inputMaskVisible={inputMaskVisible}
        setInputMaskVisible={setInputMaskVisible}
        addTeammemberToList={addTeammember}
      />
    </>
  );
}
