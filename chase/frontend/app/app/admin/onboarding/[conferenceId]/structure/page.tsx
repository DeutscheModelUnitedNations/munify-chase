"use client";
import React, { useEffect, useRef, useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import { Toast } from "primereact/toast";
import { confirmPopup } from "primereact/confirmpopup";

import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import CommitteeTable from "@/components/admin/structure/committee_table";
import AddCommitteeDialog from "@/components/admin/structure/add_committee_dialog";
import useMousetrap from "mousetrap-react";
import { Committee, CreateCommitteePayload } from "@/custom_types/fetching";

export default function structure({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  async function getCommittees(id: string) {
    try {
      const res = await backend.conference[id].committee.get();
      return res.data;
    } catch (_error) {
      toast.current.show({
        severity: "error",
        summary: LL.admin.onboarding.error.title(),
        detail: LL.admin.onboarding.error.generic(),
      });
    }
  }

  const [inputMaskVisible, setInputMaskVisible] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [updateCommittees, setUpdateCommittees] = useState(true);
  const [committees, setCommittees] = useState<
    Awaited<ReturnType<typeof getCommittees>>
  >([]);

  useEffect(() => {
    if (updateCommittees) {
      getCommittees(params.conferenceId).then((data) => {
        setCommittees(data);
        setUpdateCommittees(false);
      });
    }
  }, [updateCommittees, params.conferenceId]);

  async function addCommittee({
    name,
    abbreviation,
    category,
    parentId,
  }: CreateCommitteePayload) {
    let payload: CreateCommitteePayload = {
      name,
      abbreviation,
      category,
    };
    if (parentId) {
      payload = {
        ...payload,
        parentId,
      };
    }
    backend.conference[params.conferenceId].committee
      .post(payload)
      .then((_res) => {
        setInputMaskVisible(false);
        setUpdateCommittees(true);
        toast.current.show({
          severity: "success",
          summary: LL.admin.onboarding.structure.SUCCESS_ADD_COMMITTEE(),
          detail: `${name} (${abbreviation})`,
        });
      })
      .catch((_err) => {
        toast.current.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  }

  const confirmDeleteAll = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: LL.admin.onboarding.structure.DELETE_ALL_CONFIRM(),
      acceptClassName: "p-button-danger",
      accept: () => {
        backend.conference[params.conferenceId].committee
          .delete()
          .then((_res) => {
            setUpdateCommittees(true);
          })
          .catch((_err) => {
            toast.current.show({
              severity: "error",
              summary: LL.admin.onboarding.error.title(),
              detail: LL.admin.onboarding.error.generic(),
            });
          });
      },
    });
  };

  async function handleDelete(rawData: Committee) {
    if (!rawData) return;
    backend.conference[params.conferenceId].committee[rawData.id]
      .delete()
      .then((_res) => {
        setUpdateCommittees(true);
      })
      .catch((_err) => {
        toast.current.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  }

  // Eventlistener for N key
  useMousetrap("n", () => {
    setInputMaskVisible(true);
  });

  const handleSave = () => {
    setSaveLoading(true);
    router.push(`/app/admin/onboarding/${params.conferenceId}/teampool`);
  };

  return (
    <>
      <OnboardingSteps activeIndex={0} />
      <CommitteeTable
        committees={committees}
        confirmDeleteAll={confirmDeleteAll}
        handleDelete={handleDelete}
        setInputMaskVisible={setInputMaskVisible}
      />

      <ForwardBackButtons
        backURL="/admin/login"
        handleSaveFunction={handleSave}
        saveLoading={saveLoading}
        forwardDisabled={committees?.length === 0 || !committees}
      />

      <AddCommitteeDialog
        inputMaskVisible={inputMaskVisible}
        setInputMaskVisible={setInputMaskVisible}
        addCommitteeToList={addCommittee}
        committees={committees}
      />
      <Toast ref={toast} />
    </>
  );
}
