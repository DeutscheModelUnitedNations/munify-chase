"use client";
import React, { useContext, useEffect, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import TeamPoolTable from "@/components/admin/teampool/teampool_table";
import AddTeammemberDialog from "@/components/admin/teampool/add_teammember_dialog";
import { confirmPopup } from "primereact/confirmpopup";
import { useToast } from "@/contexts/toast";
import { ConferenceIdContext } from "@/contexts/committee_data";
import { $Enums } from "../../../../../../../backend/prisma/generated/client";

type TeamType = Awaited<
  ReturnType<(typeof backend.conference)["conferenceId"]["member"]["get"]>
>["data"];

export default function Teampool() {
  const { LL } = useI18nContext();
  const { toastError } = useToast();
  const router = useRouter();
  const conferenceId = useContext(ConferenceIdContext);

  const [team, setTeam] = useState<TeamType | null>(null);
  const [inputMaskVisible, setInputMaskVisible] = useState(false);
  const [updateTable, setUpdateTable] = useState(true);

  const [saveLoading, setSaveLoading] = useState(false);

  async function getTeam() {
    if (!conferenceId) return;
    await backend.conference[conferenceId].member
      .get()
      .then((res) => {
        if (res.status >= 400) throw new Error("Failed to fetch team");
        setTeam(res.data);
      })
      .catch((error) => {
        toastError(error);
      });
  }

  useEffect(() => {
    if (updateTable) {
      getTeam();
      setUpdateTable(false);
    }
  }, [updateTable]);

  const addTeammember = ({
    role,
    count,
  }: { role: $Enums.ConferenceRole; count: number }) => {
    if (!conferenceId) return;
    backend.conference[conferenceId].member
      .post({
        data: {
          role,
        },
        count,
      })
      .then((_res) => {
        setUpdateTable(true);
      })
      .catch((err) => {
        toastError(err);
      });
  };

  const confirmDeleteAll = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: LL.admin.onboarding.structure.DELETE_ALL_CONFIRM(),
      acceptClassName: "p-button-danger",
      accept: () => {
        if (!conferenceId) return;
        backend.conference[conferenceId].member
          .delete()
          .then(() => {
            setUpdateTable(true);
          })
          .catch((err) => {
            toastError(err);
          });
      },
    });
  };

  const handleDelete = (id: string) => {
    if (!conferenceId) return;
    backend.conference[conferenceId].member[id]
      .delete()
      .then((_res) => {
        setUpdateTable(true);
      })
      .catch((err) => {
        toastError(err);
      });
  };

  const handleSave = () => {
    setSaveLoading(true);
    router.push(`/app/admin/onboarding/${conferenceId}/committees`);
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
        backURL={`/app/admin/onboarding/${conferenceId}/structure`}
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
