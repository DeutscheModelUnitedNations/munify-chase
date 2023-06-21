"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Sidebar } from "primereact/sidebar";
import { Card } from "primereact/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getFlagPathByCode from "@/misc/get_flag_path_by_code";
import { CountryCode } from "@/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";

/**
 * This Component is used in the Login Page for the participants. It is the second step of the login process.
 * It displays a form that first previews the given committee and country (or NSA) and then asks for the password.
 * The password is verified by the server.
 * Participants that represent a Non-State Actor (NSA) can select their committee by clicking on the committee placeholder,
 * which displays a plus if no committee is selected yet and opens a sidebar with a list of all committees.
 */
// TODO: Type this function properly
// @ts-ignore
export default function usernameLogin({ changeLoginState }) {
  const router = useRouter();
  const { LL } = useI18nContext();

  const [loading, setLoading] = useState(false);

  const [isNonStateActor, setIsNonStateActor] = useState(true);
  const [committee, setCommittee] = useState("N/A");
  const [selectCommittee, setSelectCommittee] = useState(false);
  const [countryCode, setCountry] = useState<CountryCode>("cpv"); // Placeholder SVG

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isNonStateActor) {
      setCommittee("+"); // TODO Maybe make this more elegant?
    }
  }, []);

  const defaultValues = {
    countryCode: "cpv", // Placeholder UN flag SVG
    committee: "N/A",
    agreedToTerms: false,
    password: "",
  };

  const { handleSubmit: handleLogin, reset } = useForm({ defaultValues });

  const submitDisabled = () => {
    return !agreedToTerms || password === "";
  };

  // TODO Type data properly
  // @ts-ignore
  const onSubmit = (data) => {
    setLoading(true);
    // TODO verify password, set cookie and advance to Dashboard
    router.push("/participant/dashboard");
  };

  return (
    <>
      <Sidebar
        visible={selectCommittee}
        onHide={() => setSelectCommittee(false)}
      >
        <h2 className="mb-10">
          {LL.login.participant.committeeSelection.HEADLINE()}
        </h2>
        <div className="flex flex-col gap-5">
          {/* TODO Find another way of letting NSAs select their committee. Preferably after the login process is already finished to keep information private. */}
          <Card
            title="GV"
            subTitle="Generalversammlung"
            footer={
              <Button
                label="Auswählen"
                onClick={() => {
                  setCommittee("GV");
                  setSelectCommittee(false);
                }}
              />
            }
          />
          <Card
            title="HA3"
            subTitle="Hauptausschuss 3"
            footer={
              <Button
                label="Auswählen"
                onClick={() => {
                  setCommittee("HA3");
                  setSelectCommittee(false);
                }}
              />
            }
          />
          <Card
            title="WiSo"
            subTitle="Wirtschafts- und Sozialrat"
            footer={
              <Button
                label="Auswählen"
                onClick={() => {
                  setCommittee("WiSo");
                  setSelectCommittee(false);
                }}
              />
            }
          />
        </div>
      </Sidebar>
      <div className="flex flex-col p-5 items-center justify-center h-full">
        <div className="flex flex-row gap-5 mb-5">
          <div className="flex-1 flex flex-col rounded-lg border border-gray-300 justify-center items-center">
            <p className="m-auto text-sm mt-5 mb-0">
              {LL.login.participant.COMMITTEE_LABEL()}
            </p>
            <div
              className="text-3xl m-5 rounded-md border border-black h-24 flex align-center justify-center w-32"
              onClick={() => {
                if (isNonStateActor) {
                  setSelectCommittee(true);
                }
              }}
              onKeyDown={() => {
                if (isNonStateActor) {
                  setSelectCommittee(true);
                }
              }}
            >
              <div className="self-center p-1">{committee}</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col rounded-lg border border-gray-300 justify-center items-center">
            <p className="m-auto text-sm mt-5">
              {LL.login.participant.COUNTRY_LABEL()}
            </p>
            <div className="m-5 rounded-md overflow-hidden border border-black h-24 w-32">
              <Image
                src={getFlagPathByCode(countryCode)}
                alt="Flag"
                width={600}
                height={400}
                style={{ objectFit: "cover", height: "100%", width: "100%" }}
              />
            </div>
          </div>
        </div>
        {/* TODO This form can be a component that is used in both chair and participant login password components */}
        <form onSubmit={handleLogin(onSubmit)} className="contents">
          <Password
            placeholder={LL.login.PASSWORD_PLACEHOLDER()}
            feedback={false}
            style={{
              marginBottom: "1.25rem",
              marginRight: "auto",
              marginLeft: "auto",
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex flex-column align-items-center gap-2">
            <Checkbox
              inputId="agreementTerms"
              name="agreementTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.checked as boolean)}
            />
            <span
              className="text-xs mb-5"
              onClick={() => {
                setAgreedToTerms(!agreedToTerms);
              }}
              onKeyDown={() => {
                setAgreedToTerms(!agreedToTerms);
              }}
            >
              {LL.login.legalNotice.SECTION_1()}
              <Link
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="underline"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {LL.login.legalNotice.TERMS_LINK()}
              </Link>
              {LL.login.legalNotice.SECTION_2()}
              <Link
                href="privacy"
                target="_blank"
                rel="noreferrer"
                className="underline"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                {LL.login.legalNotice.PRIVACY_LINK()}
              </Link>
              {LL.login.legalNotice.SECTION_3()}
            </span>
          </div>
          <div className="flex flex-row justify-center gap-5">
            <Button
              className="mb-5"
              label={LL.login.BACK_BUTTON()}
              icon="pi pi-arrow-left"
              severity="danger"
              onClick={() => {
                changeLoginState(0);
                reset(defaultValues);
              }}
            />
            <Button
              label={LL.login.LOGIN_BUTTON()}
              type="submit"
              icon="pi pi-arrow-right"
              iconPos="right"
              loading={loading}
              disabled={submitDisabled()}
            />
          </div>
        </form>
      </div>
    </>
  );
}
