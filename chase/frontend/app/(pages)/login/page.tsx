"use client";
import { useToast } from "@/contexts/toast";
import Image from "next/image";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default () => {
  const { LL, locale } = useI18nContext();
  const router = useRouter();
  const toast = useToast();
  const [userStateLoading, setUserStateLoading] = useState(false);
  const [userCreateLoading, setCreateLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [userCreatedSuccessfullyLoading, setCreatedSuccessfullyLoading] =
    useState(false);
  const [userState, setUserState] =
    useState<Awaited<ReturnType<typeof backend.auth.userState.get>>["data"]>();
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | undefined>();
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (email) {
      setEmailValid(emailRegex.test(email));
    } else {
      setEmailValid(undefined);
    }
  }, [email]);

  useEffect(() => {
    (async () => {
      setUserStateLoading(true);
      const res = await backend.auth.userState.get({
        $query: {
          email,
        },
      });
      if (res.error) {
        toast.showToast({
          severity: "error",
          summary: res.error.message,
        });
      } else {
        setUserState(res.data);
      }
      setUserStateLoading(false);
    })();
  }, [email, toast]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password) {
      setLoginLoading(true);
      const res = await backend.auth.password.login.post({
        email,
        password,
      })
      if (res.error) {
        toast.showToast({
          severity: "error",
          summary: res.error.message,
        });
        setLoginLoading(false);
        return;
      }
      router.push("/");
    } else {
      setCreateLoading(true);
      const res = await backend.auth.createUser.post({
        locale,
        email,
      });
      if (res.error) {
        toast.showToast({
          severity: "error",
          summary: res.error.message,
        });
      } else {
        setCreatedSuccessfullyLoading(true);
      }
      setCreateLoading(false);
    }
  }

  return (
    <>
      {userCreatedSuccessfullyLoading === true ? (
        <>
          <Image
            src="/undraw/order_confirmed.svg"
            alt="decorative success drawing"
            width={300}
            height={300}
            className="mb-10"
          />
          <p>{LL.login.CREATION_SUCCESS()}</p>
        </>
      ) : (
        <>
          <h1 className="font-bold text-4xl mb-4">{LL.login.LOGIN_TITLE()}</h1>
          <p className="mb-8 text-lg">{LL.login.LOGIN_DESCRIPTION()}</p>
          <form onSubmit={submit} className="w-full">
            <span className="p-float-label w-full mb-2">
              <InputText
                className="w-full"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email">{LL.login.EMAIL_PLACEHOLDER()}</label>
            </span>
            {emailValid === false ? (
              <small className="text-red-500">{LL.login.EMAIL_INVALID()}</small>
            ) : undefined}
            {emailValid === true ? (
              <>
                {userStateLoading === true ? (
                  <span className="flex w-full justify-center mt-3">
                    <FontAwesomeIcon
                      icon={faSpinnerThird}
                      spin={true}
                      size="2x"
                    />
                  </span>
                ) : undefined}
                {userState === "userNotFound" ? (
                  <>
                    <p className="w-full text-center mb-8">
                      {LL.login.ACCOUNT_NOT_YET_CREATED()}
                    </p>
                    <Button
                      type="submit"
                      label={LL.login.CREATE_ACCOUNT()}
                      className="w-full mt-3"
                    >
                      {userCreateLoading === true ? (
                        <FontAwesomeIcon icon={faSpinnerThird} spin={true} />
                      ) : undefined}
                    </Button>
                  </>
                ) : undefined}
                {userState === "ok" ? (
                  <>
                    <InputText
                      className="w-full"
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">
                      {LL.login.PASSWORD_PLACEHOLDER()}
                    </label>
                    <Button
                      type="submit"
                      label={LL.login.LOGIN_BUTTON()}
                      className="w-full mt-3"
                    >
                      {loginLoading === true ? (
                        <FontAwesomeIcon icon={faSpinnerThird} spin={true} />
                      ) : undefined}
                    </Button>
                  </>
                ) : undefined}
                {userState === "emailNotValidated" ? (
                  <p className="text-red-500">
                    {LL.login.EMAIL_NOT_CONFIRMED()}
                  </p>
                ) : undefined}
              </>
            ) : undefined}
          </form>
        </>
      )}
    </>
  );
};
