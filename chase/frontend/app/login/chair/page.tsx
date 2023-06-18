"use client";
import React, { useState, useEffect, useRef, RefObject } from "react";
import Image from "next/image";
import { Messages } from "primereact/messages";

import UsernameLogin from "@/components/login/username";
import PasswordLogin from "@/components/login/password_chair";
import Link from "next/link";
import { useI18nContext } from "@/i18n/i18n-react";

export default function loginVorsitz() {
  const { LL } = useI18nContext();
  const [loginStage, changeLoginState] = useState(0);

  const chairLoginWarning: RefObject<Messages> = useRef<Messages>(null);

  useEffect(() => {
    // TODO Change this Warning to a permanent prime react message warning
    chairLoginWarning.current?.show([
      {
        sticky: true,
        closable: false,
        severity: "warn",
        // summary: "Warnung",
        detail: LL.login.chair.WARNING_MESSAGE(),
      },
    ]);
  }, []);

  return (
    <>
      <div className="flex justify-center items-center m-10">
        <Image
          src={"/logo/png/chase_logo_blue_text.png"}
          alt="Logo"
          width={400}
          height={128}
        />
      </div>
      {(loginStage === 0 && (
        <>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="m-5">
              <Messages ref={chairLoginWarning} />
            </div>
            <UsernameLogin changeLoginState={changeLoginState} />
            <p className="mt-10 text-gray-400 hover:text-black underline text-xs text-center">
              <Link href="/login/participant">
                {LL.login.chair.OTHER_SIGN_IN()}
              </Link>
            </p>
          </div>
          <div className="flex flex-col justify-center items-center m-10">
            <p className="text-sm text-gray-500">Powered by</p>
            <Image
              src="/dmunlogo/dmun_logo.png"
              alt="Logo"
              width={100}
              height={64}
              className="ml-2"
            />
          </div>
        </>
      )) ||
        (loginStage === 1 && (
          <PasswordLogin changeLoginState={changeLoginState} />
        ))}
    </>
  );
}
