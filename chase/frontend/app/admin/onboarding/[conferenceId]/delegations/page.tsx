"use client";
import DelegationsTable from "@/components/admin/delegations/delegations_table";
import ForwardBackButtons from "@/components/admin/onboarding/forward_back_bar";
import OnboardingSteps from "@/components/admin/onboarding/steps";
import { useBackend } from "@/contexts/backend";
import { Alpha3Code } from "@/custom_types/custom_types";
import { Committee, Delegation } from "@/custom_types/fetching";
import { useI18nContext } from "@/i18n/i18n-react";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

export default function loginVorsitz({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL, locale } = useI18nContext();
  const backend = useBackend();
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const [update, setUpdate] = useState(true);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);

  async function getCommittees(id: string) {
    const res = await backend.conference[id].committee.list
      .get()
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
    return res.data;
  }

  async function getDelegations(id: string) {
    const res = await backend.conference[id].delegations.list
      .get()
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
    return res.data;
  }

  async function createDelegation(id: string, alpha3Code: Alpha3Code) {
    const res = await backend.conference[id].delegations.create
      .post({
        alpha3Code,
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  }

  async function deleteDelegation(id: string, delegationId: string) {
    await backend.conference[id].delegations[delegationId]
      .delete()
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
    setUpdate(true);
  }

  async function activateCommittee(
    id: string,
    delegationId: string,
    committeeId: string
  ) {
    const res = await backend.conference[id].delegations[
      delegationId
    ].connectCommittee
      .post({
        committeeId,
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
    return res;
  }

  async function deactivateCommittee(
    id: string,
    delegationId: string,
    connectionId: string
  ) {
    await backend.conference[id].delegations[delegationId].disconnectCommittee
      .post({
        id: connectionId,
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  }

  async function activateOrDeactivateCommittee(
    id: string,
    delegationId: string,
    committeeId: string
  ) {
    const res = await activateCommittee(id, delegationId, committeeId);

    // if there was already a connection, the server will respond with a 208 status code and provide the id of the Delegate
    if (res.status === 208) {
      await deactivateCommittee(id, delegationId, res.data);
    }
    setUpdate(true);
  }

  useEffect(() => {
    getCommittees(params.conferenceId).then((res) => {
      setCommittees(res);
    });
    getDelegations(params.conferenceId).then((res) => {
      setDelegations(res);
    });
    setUpdate(false);
  }, [update]);

  return (
    <>
      <OnboardingSteps activeIndex={3} />

      <DelegationsTable
        conferenceId={params.conferenceId}
        delegations={delegations}
        committees={committees}
        activateOrDeactivateCommittee={activateOrDeactivateCommittee}
        deleteDelegation={deleteDelegation}
      />

      <ForwardBackButtons
        backURL={`/admin/onboarding/${params.conferenceId}/committees`}
        forwardDisabled={false}
      />
    </>
  );
}


