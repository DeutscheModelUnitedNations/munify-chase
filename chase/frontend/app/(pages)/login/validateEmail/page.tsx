"use client";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "primereact/button";
import Link from "next/link";

export default () => {
  const { LL } = useI18nContext();
  const [errored, setErrored] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [credentialCreateToken, setCredentialCreateToken] = useState<
    string | undefined
    >();
    
    // biome-ignore lint/correctness/useExhaustiveDependencies: yeah this should probably done more reacty, please give me some svelte
    useEffect(() => {
    const searchParams = useSearchParams();
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

      //TODO: these error messages are copied into the html and therefore are not responsive to language changes
      // I want to ignore this for now since its super rare that the user will see this but it should be fixed
      // in general it would be nice to take another look at the topic of how we present error messages to the user
      // and how we pass them along from the backend to the frontend, how we i18n them
      if (r.error) {
        setErrored(true);
        setErrorMessage(LL.login.EMAIL_CONFIRMED_SERVER_ERROR());
        return;
      }

      if (r.data === "emailNotFound") {
        setErrored(true);
        setErrorMessage(LL.login.EMAIL_NOT_FOUND());
        return;
      }

      if (r.data === "emailDoesNotHaveActiveValidationToken") {
        setErrored(true);
        setErrorMessage(LL.login.EMAIL_NO_ACTIVE_VALIDATION_TOKEN());
        return;
      }

      if (r.data === "invalidToken") {
        setErrored(true);
        setErrorMessage(LL.login.EMAIL_INVALID_TOKEN());
        return;
      }

      if (r.data === "alreadyValidated") {
        setErrored(true);
        setErrorMessage(LL.login.EMAIL_ALREADY_VALIDATED());
        return;
      }

      if (r.data === "tokenExpired") {
        setErrored(true);
        setErrorMessage(LL.login.EMAIL_VALIDATION_TOKEN_EXPIRED());
        return;
      }

      setErrored(false);

      setCredentialCreateToken(r.data.credentialCreateToken);
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
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size="3x"
          className="text-primary-500"
        />
      ) : undefined}
      {errored === false ? (
        <Link
          href={`/login/createCredentials?email=${email}&token=${credentialCreateToken}`}
        >
          <Button
            type="button"
            label={LL.login.SET_CREDENTIALS()}
            className="w-full mt-3"
          />
        </Link>
      ) : undefined}
    </>
  );
};
