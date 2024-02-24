"use client";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ConferenceIdContext } from "./committee_data";

export type User = NonNullable<
  Awaited<ReturnType<typeof backend.auth.myInfo.get>>["data"]
>;
type Delegation = Awaited<
  ReturnType<
    (typeof backend.conference)["conferenceId"]["user"]["userId"]["delegation"]["get"]
  >
>["data"];

export const UserIdent = createContext(
  {} as {
    userIdent: User | null;
    conferenceMembership: (
      conferenceId: string,
    ) => User["conferenceMemberships"][number] | null;
  },
);
export const useUserIdent = () => useContext(UserIdent);

export const MyDelegationContext = createContext(
  {} as { delegation: Delegation | null },
);

export const UserIdentProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const router = useRouter();

  const [userIdent, setUserIdent] = useState<User | null>(null);

  const conferenceMembership = (conferenceId: string) =>
    userIdent?.conferenceMemberships.find(
      (c) => c.conference.id === conferenceId,
    ) ?? null;

  async function getMyInfo() {
    await backend.auth.myInfo
      .get()
      .then((res) => {
        if (res.status > 400) {
          router.push("/login");
          return;
        }
        setUserIdent(res.data);
      })
      .catch((err) => {
        router.push("/login");
      });
  }

  useEffect(() => {
    getMyInfo();
  }, []);

  return (
    <UserIdent.Provider value={{ userIdent, conferenceMembership }}>
      {children}
    </UserIdent.Provider>
  );
};

export const MyDelegationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userIdent = useUserIdent();
  const conferenceId = useContext(ConferenceIdContext);

  const [delegation, setDelegation] = useState<Delegation | null>(null);

  async function getMyDelegation() {
    if (!userIdent?.userIdent?.id || !conferenceId) return;
    await backend.conference[conferenceId].user[
      userIdent.userIdent.id
    ].delegation
      .get()
      .then((res) => {
        setDelegation(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getMyDelegation();
  }, [userIdent]);

  return (
    <MyDelegationContext.Provider value={{ delegation }}>
      {children}
    </MyDelegationContext.Provider>
  );
};
