"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { useI18nContext } from "@/i18n/i18n-react";
import { InputText } from "primereact/inputtext";
import {
  faInfoCircle,
  faLock,
  faRightToBracket,
  faSparkles,
  faSpinnerThird,
} from "@fortawesome/pro-solid-svg-icons";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "primereact/skeleton";
import { backend } from "@/services/backend";
import { useToast } from "@/contexts/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordRegex =
  /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;

export default () => {
  const { LL, locale } = useI18nContext();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | undefined>();
  const [passwordValid, setPasswordValid] = useState<boolean | undefined>();
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [userType, setUserType] =
    useState<Awaited<ReturnType<typeof backend.auth.userState.get>>["data"]>();
  const [loadingUserType, setLoadingUserType] = useState(false);
  const [loadingCreationResult, setLoadingCreationResult] = useState(false);
  const [createNewUserType, setCreateNewUserType] = useState<
    "password" | "passkey"
  >("password");

  useEffect(() => {
    (async () => {
      if (!email || email === "" || !emailValid) {
        setUserType(null);
        return;
      }

      setLoadingUserType(true);
      const ret = await backend.auth.userState.get({
        $query: {
          email,
        },
      });

      setLoadingUserType(false);

      if (ret.data) {
        setUserType(ret.data);
      } else if (ret.error) {
        toast.showToast({
          severity: "error",
          summary: ret.error.message,
        });
      }
    })();
  }, [email, emailValid]);

  useEffect(() => {
    if (!email || email === "") {
      setEmailValid(undefined);
      return;
    }

    if (emailRegex.test(email.toLowerCase())) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  }, [email]);

  useEffect(() => {
    if (!password || password === "") {
      setPasswordValid(undefined);
      return;
    }

    if (passwordRegex.test(password)) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  }, [password]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoadingCreationResult(true);
    const r = await backend.auth.createUserWithPassword.post({
      email,
      password,
      locale,
    });
    setLoadingCreationResult(false);

    if (r.error) {
      toast.showToast({
        severity: "error",
        summary: r.error.message,
      });
      return;
    }

    setCreationSuccess(true);
  };

  const reset = () => {
    setCreationSuccess(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="bg-white p-10 rounded-3xl flex flex-col items-center max-w-2xl w-full">
      {!creationSuccess ? (
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

            {loadingUserType && emailValid ? (
              <span className="flex w-full justify-center">
                <FontAwesomeIcon icon={faSpinnerThird} spin={true} size="2x" />
              </span>
            ) : undefined}
            {userType && emailValid ? (
              <>
                {userType === "notFound" ? (
                  <>
                    <span className="w-full flex justify-center mb-6 mt-4">
                      <button
                        type="button"
                        onClick={() => setCreateNewUserType("password")}
                        className="mr-4"
                      >
                        <Chip
                          label={LL.login.PASSWORD()}
                          className={
                            createNewUserType === "password"
                              ? "border-2 border-primary-600 duration-300"
                              : "duration-300"
                          }
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreateNewUserType("passkey")}
                      >
                        <Chip
                          label={LL.login.PASSKEY()}
                          className={
                            createNewUserType === "passkey"
                              ? "border-2 border-primary-600 duration-300"
                              : "duration-300"
                          }
                        />
                      </button>
                    </span>
                    {createNewUserType === "password" ? (
                      <>
                        <p className="w-full text-center mb-8">
                          {LL.login.ACCOUNT_NOT_YET_CREATED()}
                        </p>
                        <span className="p-float-label w-full mb-2">
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
                        </span>
                        {passwordValid === false ? (
                          <small className="text-red-500">
                            {LL.login.PASSWORD_INVALID()}
                          </small>
                        ) : undefined}
                        {passwordValid === true ? (
                          <>
                            <Button
                              type="submit"
                              label={LL.login.CREATE_ACCOUNT()}
                              className="w-full mt-3"
                            >
                              {loadingCreationResult ? (
                                <FontAwesomeIcon
                                  icon={faSpinnerThird}
                                  spin={true}
                                />
                              ) : undefined}
                            </Button>
                          </>
                        ) : undefined}
                      </>
                    ) : (
                      <>
                        <Link
                          href="https://www.passkeys.com"
                          target="_blank"
                          className="flex text-gray-400 items-center"
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                          <p className="ml-2">{LL.login.WHAT_ARE_PASSKEYS()}</p>
                        </Link>
                      </>
                    )}
                  </>
                ) : undefined}
              </>
            ) : undefined}
          </form>
        </>
      ) : (
        <>
          <Image
            src="/undraw/order_confirmed.svg"
            alt="decorative success drawing"
            width={300}
            height={300}
            className="mb-10"
          />
          <p>{LL.login.CREATION_SUCCESS()}</p>
          <Button
            type="button"
            onClick={reset}
            label={LL.login.LOGIN_NOW()}
            className="w-full mt-3"
          />
        </>
      )}
    </div>
  );
};

// export default function Login() {
//   const { LL } = useI18nContext();
//   const backend = useBackend();
//   const toast = useRef<Toast>(null);
//   const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [conferenceId, setConferenceId] = useState("");
//   const [myConferences, setMyConferences] = useState<
//     Awaited<ReturnType<typeof getMyConferences>>
//   >(null);

//   async function getMyConferences() {
//     const response = await backend.listMyConferences.get().catch((err) => {
//       toast.current?.show({
//         severity: "error",
//         summary: LL.admin.onboarding.error.title(),
//         detail: LL.admin.onboarding.error.generic(),
//       });
//     });
//     setMyConferences(response?.data || []);
//   }

//   useEffect(() => {
//     getMyConferences();
//   }, []);

//   const submit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     backend.conference[conferenceId].registerAdmin
//       .post()
//       .then((res) => {
//         toast.current?.show({
//           severity: "success",
//           summary: LL.admin.onboarding.success(),
//           detail: LL.admin.onboarding.successDetails(),
//         });

//         router.push(`/admin/onboarding/${conferenceId}/structure`);
//       })
//       .catch((err) => {
//         toast.current?.show({
//           severity: "error",
//           summary: LL.admin.onboarding.error.title(),
//           detail: LL.admin.onboarding.error.generic(),
//         });
//         setLoading(false);
//       });
//   };

//   return (
//     <>
//       <Image
//         src="/logo/png/chase_logo_white_text.png"
//         alt="Logo"
//         width={350}
//         height={128}
//         className="mb-10"
//       />
//       <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-primary-200 w-96 p-5 rounded-md shadow-lg">
//         <form
//           className="flex flex-col items-stretch justify-center gap-6 w-full"
//           onSubmit={(e) => submit(e)}
//         >
//           <h1 className="text-2xl font-bold text-center mb-4">
//             {LL.admin.login.TITLE()}
//           </h1>
//           <div className="flex flex-col gap-2">
//             {myConferences === null && (
//               <>
//                 <Skeleton height="3rem" />
//                 <Skeleton height="3rem" />
//               </>
//               )}
//             {myConferences && (myConferences.map((conference) => (
//               <Link
//                 href={`/admin/onboarding/${conference.id}/structure`}
//                 key={conference.id}
//               >
//                 <Button
//                   label={conference.name}
//                   className="w-full"
//                   severity="secondary"
//                 />
//               </Link>
//             )))}
//           </div>
//           <span className="p-float-label mb-5">
//             <InputText
//               id="conferenceId"
//               value={conferenceId}
//               onChange={(e) => setConferenceId(e.target.value)}
//               className="w-full"
//               required
//             />
//             <label htmlFor="conferenceId">
//               {LL.admin.login.CONFERENCE_ID()}
//             </label>
//           </span>
//           <div className="flex w-full gap-4">
//             <Button
//               label={LL.admin.login.CREATE_INSTEAD()}
//               className="w-full"
//               severity="warning"
//               faIcon={faSparkles}
//               onClick={() => router.push("/admin/new")}
//             />
//             <Button
//               label={LL.admin.login.SUBMIT()}
//               className="w-full"
//               faIcon={faRightToBracket}
//               type="submit"
//               loading={loading}
//             />
//             <Toast ref={toast} />
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }
