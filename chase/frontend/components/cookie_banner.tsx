import React, { useState, useEffect, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import CookieConsent from "react-cookie-consent";
import Button from "./button";
import Link from "next/link";
import { faCookieBite } from "@fortawesome/pro-solid-svg-icons";

export default function CookieBanner() {
  const { LL, locale } = useI18nContext();

  const cookieConsentRef = useRef<CookieConsent | null>(null);

  const handleAcceptButtonClick = () => {
    // @ts-ignore
    cookieConsentRef?.current?.accept?.();
  };

  return (
    <>
      <CookieConsent
        ref={cookieConsentRef}
        location="bottom"
        buttonText="Accept"
        cookieName="cookieConsent"
        style={{
          zIndex: 1000,
        }}
        containerClasses="flex flex-col sm:flex-row min-h-40 items-center justify-center w-full bg-primary-200 bg-opacity-80 text-white fixed bottom-0 left-0 z-50"
        contentClasses="h-full flex-1 flex flex-col justify-center w-full p-4"
        ButtonComponent={() => (
          <div className="p-4">
            <Button
              severity="info"
              faIcon={faCookieBite}
              label={LL.cookieBanner.ACCEPT()}
              onClick={() => handleAcceptButtonClick()}
            />
          </div>
        )}
        expires={150}
        disableStyles={true}
      >
        <h1 className="text-2xl font-bold font-serif mb-2">
          {LL.cookieBanner.HEADLINE()}
        </h1>
        <p>{LL.cookieBanner.TEXT()}</p>
        <p className="text-xs mt-2">
          {LL.cookieBanner.SUBTEXT()}{" "}
          <Link href="/privacy-policy" className=" underline hover:font-bold">
            {LL.cookieBanner.PRIVACY_POLICY()}
          </Link>
          .
        </p>
      </CookieConsent>
    </>
  );
}
