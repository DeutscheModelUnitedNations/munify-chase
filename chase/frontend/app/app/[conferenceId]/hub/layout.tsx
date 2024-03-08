"use client";
import React from "react";
import { MessageCountProvider } from "@/contexts/messages";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessageCountProvider>{children}</MessageCountProvider>;
}
