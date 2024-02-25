"use client";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ConferenceIdContext } from "./committee_data";

export type User = NonNullable<
  Awaited<ReturnType<typeof backend.auth.myInfo.get>>["data"]
>;
type ConferenceMembership = User["conferenceMemberships"][number];
type Delegation = NonNullable<
  Awaited<
    ReturnType<
      (typeof backend.conference)["conferenceId"]["user"]["userId"]["delegation"]["get"]
    >
  >["data"]
>;

interface UserIdentContextType {
  userIdent: User;
  conferenceMembership: (
    conferenceId: string | null | undefined,
  ) => ConferenceMembership | undefined;
}

interface MyDelegationContextType {
  delegation: Delegation | null;
}

export const UserIdentContext = createContext<UserIdentContextType | undefined>(
  undefined,
);
export const useUserIdent = () => useContext(UserIdentContext);
export const MyDelegationContext =
  createContext<MyDelegationContextType | null>(null);

export const UserIdentProvider = ({
  children,
}: { children: React.ReactNode }) => {
  const router = useRouter();

  const [userIdent, setUserIdent] = useState<User | null>(null);

  const conferenceMembership = (conferenceId: string | null | undefined) => {
    if (!conferenceId) return undefined;
    return userIdent?.conferenceMemberships.find(
      (c) => c.conference.id === conferenceId,
    );
  };

  useEffect(() => {
    (async () => {
      const res = await backend.auth.myInfo.get();

      if (res.status > 400) {
        router.push("/login");
        return;
      }

      setUserIdent(res.data);
    })();
  }, []);

  return (
    <UserIdentContext.Provider
      // biome-ignore lint/style/noNonNullAssertion: TODO nullable types cleanup throughout the whole app
      value={{ userIdent: userIdent!, conferenceMembership }}
    >
      {children}
    </UserIdentContext.Provider>
  );
};

export const MyDelegationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const userIdentContext = useUserIdent();
  const conferenceId = useContext(ConferenceIdContext);

  const [delegation, setDelegation] = useState<Delegation | null>(null);

  useEffect(() => {
    (async () => {
      if (!userIdentContext?.userIdent?.id || !conferenceId) return;
      const res =
        await backend.conference[conferenceId].user[
          userIdentContext?.userIdent?.id
        ].delegation.get();

      setDelegation(res.data);
    })();
  }, [userIdentContext]);

  return (
    <MyDelegationContext.Provider value={{ delegation }}>
      {children}
    </MyDelegationContext.Provider>
  );
};
