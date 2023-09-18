"use client";
import React, { useEffect, useRef, useState } from "react";

import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import { Toast } from "primereact/toast";
import { confirmPopup } from "primereact/confirmpopup";

import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import CommitteeTable from "@/components/admin/structure/committee_table";
import AddCommitteeDialog from "@/components/admin/structure/add_committee_dialog";


export default function structure({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [inputMaskVisible, setInputMaskVisible] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [committees, setCommittees] = useState<CommitteeEntry[]>([ // TODO remove dummy data
    {
      name: "Generalversammlung",
      shortname: "GV",
      category: "committee",
      isSubcommittee: false,
      parent: null,
    },
    {
      name: "Sicherheitsrat",
      shortname: "SR",
      category: "committee",
      isSubcommittee: false,
      parent: null,
    },
    {
      name: "Kommission für Friedenskonsolidierung",
      shortname: "KFK",
      category: "committee",
      isSubcommittee: true,
      parent: {
        name: "Sicherheitsrat",
        shortname: "SR",
        category: "committee",
        isSubcommittee: false,
        parent: null,
      },
    },
    {
      name: "Krisesitzung",
      shortname: "KRISE",
      category: "crisis",
      isSubcommittee: false,
      parent: null,
    },
    {
      name: "Internationaler Gerichtshof",
      shortname: "IGH",
      category: "icj",
      isSubcommittee: false,
      parent: null,
    },
  ]);

  useEffect(() => {
    backend["conference/committee/list"]
      .get({ conferenceId: params.conferenceId })
      .then((res) => {
        console.log(res);
        setCommittees(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.current.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  }, []);

  const addCommittee = (
    newCommitteeName: string,
    newCommitteeShortname: string,
    newCommitteeCategory: string,
    newCommitteeIsSubcommittee: boolean,
    newCommitteeParent: CommitteeEntry | null,
  ) => {
    setCommittees([
      ...committees,
      {
        name: newCommitteeName,
        shortname: newCommitteeShortname,
        category: newCommitteeCategory,
        isSubcommittee: newCommitteeIsSubcommittee,
        parent: newCommitteeParent,
      },
    ]);
    setInputMaskVisible(false);
  };

  const confirmDeleteAll = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: LL.admin.onboarding.structure.DELETE_ALL_CONFIRM(),
      acceptClassName: "p-button-danger",
      accept: () => {
        setCommittees([]);
      },
    });
  };

  const handleDelete = (rowData) => {
    setCommittees(committees.filter((c) => c !== rowData));
  };

  // Eventlistener for N key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "n") {
        setInputMaskVisible(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSave = () => {
    setSaveLoading(true);
    if (committees.length === 0) {
      setSaveLoading(false);
      toast.current.show({
        severity: "error",
        summary: LL.admin.onboarding.structure.ERROR_NO_COMMITTEES(),
        detail: LL.admin.onboarding.structure.ERROR_NO_COMMITTEES_DETAILS(),
      });
      return;
    }

    for (const committee of committees) {
      backend["conference/committee/create"]
        .post({
          conferenceId: parseInt(params.conferenceId),
          name: committee.name,
          abbreviation: committee.shortname,
        })
        .then((res) => {
          console.log(res);
          router.push(`/admin/onboarding/${params.conferenceId}/teampool`);
        })
        .catch((err) => {
          console.log(err);
          toast.current.show({
            severity: "error",
            summary: LL.admin.onboarding.error.title(),
            detail: LL.admin.onboarding.error.generic(),
          });
        });
      setSaveLoading(false);
    }
  };

  return (
    <>
      <OnboardingSteps activeIndex={0} />
      <CommitteeTable committees={committees} confirmDeleteAll={confirmDeleteAll} handleDelete={handleDelete} setInputMaskVisible={setInputMaskVisible} />
      
      <ForwardBackButtons backURL="/admin/new" handleSaveFunction={handleSave} saveLoading={saveLoading} />

      <AddCommitteeDialog inputMaskVisible={inputMaskVisible} setInputMaskVisible={setInputMaskVisible} addCommitteeToList={addCommittee} committees={committees} />
      <Toast ref={toast} />
    </>
  );
}
