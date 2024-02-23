"use client";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faRightToBracket } from "@fortawesome/pro-solid-svg-icons";
import Link from "next/link";
import Button from "@/components/button";

export default () => {
  const searchParams = useSearchParams();
  const { LL } = useI18nContext();
  const [errored, setErrored] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [credentialCreateToken, setCredentialCreateToken] = useState<
    string | undefined
  >();

  // biome-ignore lint/correctness/useExhaustiveDependencies: yeah this should probably done more reacty, please give me some svelte
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
      <Image
        src="/undraw/security_lockout.svg"
        alt="decorative lockout drawing"
        width={300}
        height={300}
        className="mb-10"
      />
      <h1 className="text-3xl font-bold mb-4">You have been locked out</h1>
      <p>
        You don't have permission to use this aspect of the App. Please log in
        again.
      </p>
      <div className="mt-6 w-full flex gap-4">
        <Button
          label="Log in"
          faIcon={faRightToBracket}
          onClick={() => {
            window.location.href = "/login";
          }}
          className="flex-1"
        />
        <Button
          label="Homepage"
          faIcon={faHome}
          onClick={() => {
            window.location.href = "/";
          }}
          className="flex-1"
        />
      </div>
    </>
  );
};
