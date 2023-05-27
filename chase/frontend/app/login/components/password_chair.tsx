"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import Image from "next/image";
import Link from "next/link";

export default function usernameLogin({ changeLoginState }) {
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [password, setPassword] = useState("");

  function getCountrySvgPath(country: string) {
    return `/flags/${country}.svg`;
  }

  const defaultValues = {
    agreedToTerms: false,
    password: "",
  };

  const { handleSubmit: handleLogin, reset } = useForm({ defaultValues });

  const submitDisabled = () => {
    return !agreedToTerms || password === "";
  };

  const onSubmit = (data) => {
    setLoading(true);
    // TODO verify password, set cookie and advance to Dashboard
  };

  return (
    <div className="flex flex-col p-5 items-center">
      // TODO This form can be a component that is used in both chair and participant login password components
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
            onChange={(e) => setAgreedToTerms(e.checked)}
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
  );
}
