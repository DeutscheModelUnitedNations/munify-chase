"use client";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = NonNullable<Awaited<ReturnType<typeof backend.auth.myInfo.get>>["data"]>
export const UserIdent = createContext({} as { userIdent: User });
export const useUserIdent = () => useContext(UserIdent);

export const UserIdentProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [userIdent, setUserIdent] = useState<User | null>(null);

  useEffect(() => {
    backend.auth.myInfo
      .get()
      .then((res) => {
        // if (res.status > 400) {
        //   router.push("/login");
        //   return;
        // }

        setUserIdent(res.data);

      })
      .catch((err) => {
        router.push("/login");
      });
  }, []);

  return (
    <UserIdent.Provider value={{ userIdent }}>
      {children}
    </UserIdent.Provider>
  );
};

