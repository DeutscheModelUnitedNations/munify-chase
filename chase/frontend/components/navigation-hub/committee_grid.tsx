import React, { useState, useEffect, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { Committee } from "../../../backend/prisma/generated/client";
import { Toast } from "primereact/toast";
import { Skeleton } from 'primereact/skeleton';
import Link from "next/link";

export default function CommitteeGrid({
  conferenceId,
  isChair,
}: {
  conferenceId: string;
  isChair?: boolean;
}) {
  const { LL, locale } = useI18nContext();
  const toast = useRef<Toast>(null);

  const [committees, setCommittees] = useState<Committee[] | null>(null);

  async function getCommittees() {
    await backend.conference[conferenceId].committee
      .get()
      .then((res) => {
        setCommittees(res.data);
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
      });
  }

  useEffect(() => {
    getCommittees();
  }, []);

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4">
      {committees?.map((committee) => {
          return (
            <Link
              key={committee.id}
              href={`/app/${conferenceId}/committee/${committee.id}/${isChair ? "chair" : "participant"}/dashboard`}
              className="flex-1 h-48 min-w-60 flex flex-col justify-center items-center p-4 bg-primary-950 rounded-lg hover:bg-primary-900 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer"
            >
              <h1 className="text-4xl my-8 text-primary font-bold">
                {committee.abbreviation}
              </h1>
              <h3 className="text-lg">{committee.name}</h3>
            </Link>
          );
        })}
      {committees?.length === 0 && (
        <h1 className="text-2xl">{LL.hub.NO_COMMITTEES()}</h1>
      )}
      {!committees && <>
          <Skeleton height="12rem" className="flex-1 min-w-60 bg-slate-100 rounded-lg" />
          <Skeleton height="12rem" className="flex-1 min-w-60 bg-slate-100 rounded-lg" />
          <Skeleton height="12rem" className="flex-1 min-w-60 bg-slate-100 rounded-lg" />
          </>
        }
    </div>
  );
}
