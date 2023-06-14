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

// TODO: Type this function properly
// @ts-ignore
export default function usernameLogin({ changeLoginState }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [isNonStateActor, setIsNonStateActor] = useState(true);
  const [committee, setCommittee] = useState("N/A");
  const [selectCommittee, setSelectCommittee] = useState(false);
  const [countryCode, setCountry] = useState<CountryCode>("jam"); // Placeholder SVG

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isNonStateActor) {
      setCommittee("+"); // TODO Maybe make this more elegant?
    }
  }, []);

  const defaultValues = {
    countryCode: "jam", // Placeholder UN flag SVG
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
        <h2 className="mb-10">Gremium auswählen</h2>
        <div className="flex flex-col gap-5">
          {/* TODO Replace with dynamic list of committees (probably with map function) */}
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
            <p className="m-auto text-sm mt-5 mb-0">Gremium</p>
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
            <p className="m-auto text-sm mt-5">Staat / NA</p>
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
            placeholder="Password"
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
              Ich bin Einverstanden mit den{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noreferrer"
                className="underline"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                Nutzungsbedingungen
              </Link>
              . Außerdem bin ich damit einverstanden, dass diese Website Cookies
              verwendet. Mehr Informationen dazu finden Sie in unseren{" "}
              <Link
                href="privacy"
                target="_blank"
                rel="noreferrer"
                className="underline"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                Datenschutzbestimmungen
              </Link>
              .
            </span>
          </div>
          <div className="flex flex-row justify-center gap-5">
            <Button
              className="mb-5"
              label="Zurück"
              icon="pi pi-arrow-left"
              severity="danger"
              onClick={() => {
                changeLoginState(0);
                reset(defaultValues);
              }}
            />
            <Button
              label="Anmelden"
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
