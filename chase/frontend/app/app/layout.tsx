"use client";
import { UserIdentProvider } from "@/contexts/user_ident";
import type React from "react";

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  //TODO

  return <UserIdentProvider>{children}</UserIdentProvider>;
}
