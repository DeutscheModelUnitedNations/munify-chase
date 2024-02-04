"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { useI18nContext } from "@/i18n/i18n-react";
import { InputText } from "primereact/inputtext";
import Button from "@/components/button";
import { faRightToBracket, faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "primereact/skeleton";
import { backend } from "@/services/backend";

export default function LoginVorsitz() {
  const { LL } = useI18nContext();
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [conferenceId, setConferenceId] = useState("");
  const [myConferences, setMyConferences] = useState<
    Awaited<ReturnType<typeof getMyConferences>>
  >(null);

  async function getMyConferences() {
    const response = await backend.listMyConferences.get().catch((err) => {
      toast.current?.show({
        severity: "error",
        summary: LL.admin.onboarding.error.title(),
        detail: LL.admin.onboarding.error.generic(),
      });
    });
    setMyConferences(response?.data || []);
  }

  useEffect(() => {
    getMyConferences();
  }, []);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    backend.conference[conferenceId].registerAdmin
      .post()
      .then((res) => {
        toast.current?.show({
          severity: "success",
          summary: LL.admin.onboarding.success(),
          detail: LL.admin.onboarding.successDetails(),
        });

        router.push(`/admin/onboarding/${conferenceId}/structure`);
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: LL.admin.onboarding.error.title(),
          detail: LL.admin.onboarding.error.generic(),
        });
        setLoading(false);
      });
  };

  return (
    <>
      <Image
        src="/logo/png/chase_logo_white_text.png"
        alt="Logo"
        width={350}
        height={128}
        className="mb-10"
      />
      <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-primary-200 w-96 p-5 rounded-md shadow-lg">
        <form
          className="flex flex-col items-stretch justify-center gap-6 w-full"
          onSubmit={(e) => submit(e)}
        >
          <h1 className="text-2xl font-bold text-center mb-4">
            {LL.admin.login.TITLE()}
          </h1>
          <div className="flex flex-col gap-2">
            {myConferences === null && (
              <>
                <Skeleton height="3rem" />
                <Skeleton height="3rem" />
              </>
              )}
            {myConferences && (myConferences.map((conference) => (
              <Link
                href={`/admin/onboarding/${conference.id}/structure`}
                key={conference.id}
              >
                <Button
                  label={conference.name}
                  className="w-full"
                  severity="secondary"
                />
              </Link>
            )))}
          </div>
          <span className="p-float-label mb-5">
            <InputText
              id="conferenceId"
              value={conferenceId}
              onChange={(e) => setConferenceId(e.target.value)}
              className="w-full"
              required
            />
            <label htmlFor="conferenceId">
              {LL.admin.login.CONFERENCE_ID()}
            </label>
          </span>
          <div className="flex w-full gap-4">
            <Button
              label={LL.admin.login.CREATE_INSTEAD()}
              className="w-full"
              severity="warning"
              faIcon={faSparkles}
              onClick={() => router.push("/admin/new")}
            />
            <Button
              label={LL.admin.login.SUBMIT()}
              className="w-full"
              faIcon={faRightToBracket}
              type="submit"
              loading={loading}
            />
            <Toast ref={toast} />
          </div>
        </form>
      </div>
    </>
  );
}
