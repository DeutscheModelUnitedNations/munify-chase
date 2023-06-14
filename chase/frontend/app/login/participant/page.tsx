"use client";
import React, { useState } from "react";
import Image from "next/image";

import UsernameLogin from "@/components/login/username";
import PasswordLogin from "@/components/login/password_participant";
import Loading from "@/app/loading";
import Link from "next/link";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function loginVorsitz() {
  const [loginStage, changeLoginState] = useState(0);
  const { LL } = useI18nContext();

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
            <UsernameLogin changeLoginState={changeLoginState} />
            <p className="mt-10 text-gray-400 hover:text-black underline text-xs text-center">
              <Link href="/login/chair">{LL.login.otherSignIn()}</Link>
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
