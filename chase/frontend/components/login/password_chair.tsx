"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import Link from "next/link";
import { useI18nContext } from "@/src/i18n/i18n-react";

/**
 * This Component is used in the Login Page for the Chair. It is the second step of the login process.
 * It displays a form, where the chair can enter the password. The password is verified by the server.
 */

// TODO: Type this function properly
// @ts-ignore
export default function usernameLogin({ changeLoginState }) {
  const { LL } = useI18nContext();
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [password, setPassword] = useState("");

  const defaultValues = {
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
  };

  return (
    <div className="flex flex-col p-5 items-center justify-center h-full">
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
  );
}
