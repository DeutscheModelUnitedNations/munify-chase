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
  user:
    | {
        data: User;
        conferenceMembership: (
          conferenceId: string,
        ) => ConferenceMembership | undefined;
      }
    | undefined;
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

  const conferenceMembership = (conferenceId: string) =>
    userIdent?.conferenceMemberships.find(
      (c) => c.conference.id === conferenceId,
    );

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
      value={{
        user:
          userIdent !== null
            ? { data: userIdent, conferenceMembership }
            : undefined,
      }}
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
  const userIdent = useUserIdent();
  const conferenceId = useContext(ConferenceIdContext);

  const [delegation, setDelegation] = useState<Delegation | null>(null);

  useEffect(() => {
    (async () => {
      if (!userIdent?.user?.data.id || !conferenceId) return;
      const res =
        await backend.conference[conferenceId].user[
          userIdent.user.data.id
        ].delegation.get();

      setDelegation(res.data);
    })();
  }, [userIdent]);

  return (
    <MyDelegationContext.Provider value={{ delegation }}>
      {children}
    </MyDelegationContext.Provider>
  );
};
