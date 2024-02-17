"use client";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "primereact/button";
import Link from "next/link";

export default () => {
  const searchParams = useSearchParams();
  const { LL } = useI18nContext();
  const [errored, setErrored] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token) {
      setErrored(true);
      setErrorMessage(LL.login.NO_TOKEN());
      return;
    }

    if (!email) {
      setErrored(true);
      setErrorMessage(LL.login.NO_EMAIL());
      return;
    }
    setEmail(email);

    (async () => {
      const r = await backend.auth.validateEmail.post({
        email,
        token,
      });

      if (r.error) {
        setErrored(true);
        setErrorMessage(LL.login.EMAIL_CONFIRMED_SERVER_ERROR());
        return;
      }

      setErrored(false);
    })();
  }, []);
  return (
    <>
      {errored === true ? (
        <Image
          src="/undraw/warning.svg"
          alt="decorative error drawing"
          width={300}
          height={300}
          className="mb-10"
        />
      ) : undefined}

      {errored === false ? (
        <Image
          src="/undraw/verified.svg"
          alt="decorative success drawing"
          width={300}
          height={300}
          className="mb-10"
        />
      ) : undefined}
      {errored === true ? <p>{errorMessage}</p> : undefined}
      {errored === false ? <p>{LL.login.EMAIL_CONFIRMED()}</p> : undefined}
      {errored === undefined ? (
        <FontAwesomeIcon icon={faSpinnerThird} spin={true} size="2x" />
      ) : undefined}
      {errored === false ? (
        <Link href={`/login?email=${email}`}>
          <Button
            type="button"
            label={LL.login.LOGIN_NOW()}
            className="w-full mt-3"
          />
        </Link>
      ) : undefined}
    </>
  );
};
