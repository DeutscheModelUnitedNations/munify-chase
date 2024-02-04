"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";

import { useI18nContext } from "@/i18n/i18n-react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import Button from "@/components/button";
import { faRightToBracket, faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";

export default function loginVorsitz() {
  const { LL } = useI18nContext();
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const [conferenceName, setConferenceName] = useState("");
  const [dates, setDates] = useState<Date[] | undefined>(undefined);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    backend.conference
      .post({
        name: conferenceName,
        token: token,
        start: dates[0]?.getTime().toString(),
        end: dates[1]?.getTime().toString(),
      })
      .then((res) => {
        if (!res?.data?.id) throw new Error("No conference id returned");
        const conferenceId = res.data.id;
        toast.current.show({
          severity: "success",
          summary: LL.admin.onboarding.success(),
          detail: LL.admin.onboarding.successDetails(),
        });

        router.push(`/admin/onboarding/${conferenceId}/structure`);
      })
      .catch((err) => {
        toast.current.show({
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
            {LL.admin.onboarding.title()}
          </h1>
          <span className="p-float-label mb-5">
            <InputText
              id="conferenceName"
              value={conferenceName}
              onChange={(e) => setConferenceName(e.target.value)}
              className="w-full"
              required
            />
            <label htmlFor="conferenceName">
              {LL.admin.onboarding.conferenceName()}
            </label>
          </span>
          <span className="p-float-label mb-5">
            <Calendar
              value={dates}
              onChange={(e) => setDates(e.value)}
              selectionMode="range"
              dateFormat="d.m.yy"
              readOnlyInput
              className="w-full"
            />
            <label htmlFor="dates">{LL.admin.onboarding.dates()}</label>
          </span>
          <span className="p-float-label mb-5">
            <InputText
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
              required
            />
            <label htmlFor="conferenceName">
              {LL.admin.onboarding.token()}
            </label>
          </span>
          <div className="flex w-full gap-4">
            <Button
              label={LL.admin.onboarding.login()}
              className="w-full"
              severity="warning"
              faIcon={faRightToBracket}
              onClick={() => router.push("/admin/login")}
            />
            <Button
              label={LL.admin.onboarding.submit()}
              className="w-full"
              faIcon={faSparkles}
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
