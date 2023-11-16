import { useI18nContext } from "@/i18n/i18n-react";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useRef, useState } from "react";
import { useBackend } from "@/contexts/backend";
import { Committee, Teammember } from "@/custom_types/fetching";
import { Toast } from "primereact/toast";

interface MultiSelectProps {
  conferenceId: string;
  committee: Committee;
  teammember: Teammember[] | undefined | null;
  setUpdate: (update: boolean) => void;
}

export const ChairMultiSelect = ({
  conferenceId,
  committee,
  teammember,
  setUpdate,
}: MultiSelectProps) => {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const toast = useRef<Toast>(null);

  const [committeeChairs, setCommitteeChairs] = useState<
    Teammember[] | null | undefined
  >([]);

  async function updateChairs({
    committeeId,
    chairs,
  }: {
    committeeId: string;
    chairs: string[];
  }) {
    await backend.conference[conferenceId].team.connectCommittee.chairs
      .post({
        committeeId,
        chairs,
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
    setUpdate(true);
  }

  useEffect(() => {
    setCommitteeChairs(
      teammember?.filter((chair) => chair.chair_committeeId === committee.id)
    );
  }, [teammember]);

  return (
    <span className="p-float-label mt-4">
      <MultiSelect
        value={committeeChairs}
        options={teammember || []}
        onChange={(e) => {
          setCommitteeChairs(e.value);
          updateChairs({
            committeeId: committee.id,
            chairs: e.value.map((chair: Teammember) => chair.id),
          });
        }}
        itemTemplate={(chair) => (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{chair.firstName}</span>
            <span className="text-sm">{chair.lastName}</span>
          </div>
        )}
        optionLabel="firstName"
        display="chip"
        filter
        className="w-full"
      />
      <label htmlFor="ms-cities">
        {LL.admin.onboarding.committees.CHAIRS()}
      </label>
    </span>
  );
};

export const AdvisorMultiSelect = ({
  conferenceId,
  committee,
  teammember,
  setUpdate,
}: MultiSelectProps) => {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const toast = useRef<Toast>(null);

  const [committeeAdvisors, setCommitteeAdvisors] = useState<
    Teammember[] | null | undefined
  >([]);

  async function updateAdvisors({
    committeeId,
    committeeAdvisors,
  }: {
    committeeId: string;
    committeeAdvisors: string[];
  }) {
    await backend.conference[conferenceId].team.connectCommittee.advisors
      .post({
        committeeId,
        committeeAdvisors,
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
    setUpdate(true);
  }

  useEffect(() => {
    setCommitteeAdvisors(
      teammember?.filter(
        (advisor) => advisor.advisor_committeeId === committee.id
      )
    );
  }, [teammember]);

  return (
    <span className="p-float-label mt-8">
      <MultiSelect
        value={committeeAdvisors}
        options={teammember || []}
        onChange={(e) => {
          setCommitteeAdvisors(e.value);
          updateAdvisors({
            committeeId: committee.id,
            committeeAdvisors: e.value.map((advisor: Teammember) => advisor.id),
          });
        }}
        itemTemplate={(advisor) => (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold">{advisor.firstName}</span>
            <span className="text-sm">{advisor.lastName}</span>
          </div>
        )}
        optionLabel="firstName"
        display="chip"
        filter
        className="w-full"
      />
      <label htmlFor="ms-cities">
        {LL.admin.onboarding.committees.ADVISORS()}
      </label>
    </span>
  );
};
