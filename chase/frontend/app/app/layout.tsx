"use client";
import { UserIdentProvider } from "@/contexts/user_ident";
import { useMutation, useQuery } from "@/gqty";
import type React from "react";

export default function UserIdentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [createConference, {isLoading}] = useMutation((m) => {
    m.createConference({
      data: {
        name: "My Conference",
      },
      token: "123",
    });
  });

  return <UserIdentProvider>{children}</UserIdentProvider>;
}
