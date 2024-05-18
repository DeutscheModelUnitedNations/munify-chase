"use client";
import { UserIdentProvider } from "@/contexts/user_ident";
import { useMutation } from "@/gqty";
import type React from "react";

export default function UserIdentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //TODO
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const [createConference, { isLoading }] = useMutation((m) => {
    m.createConference({
      data: {
        name: "My Conference",
      },
      token: "123",
    });
  });

  return <UserIdentProvider>{children}</UserIdentProvider>;
}
