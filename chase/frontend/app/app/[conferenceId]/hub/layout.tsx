"use client";
import React, { useState } from "react";
import SettingsSidebar from "@/components/navbar/settings_sidebar";
import { MessageCountProvider } from "@/contexts/messages";

export default function NavigationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessageCountProvider>{children}</MessageCountProvider>;
}
