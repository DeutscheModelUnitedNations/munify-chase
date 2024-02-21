"use client";
import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { backend } from "@/services/backend";
import { ScrollPanel } from "primereact/scrollpanel";

export default function COMPONENT_TITLE() {
  const { LL, locale } = useI18nContext();

  return (
    <>
      <div className="flex h-screen w-screen bg-white overflow-hidden">
        <ScrollPanel className="w-1/3 h-full border-r border-gray-200">
          Hello World
        </ScrollPanel>
        <div className="w-2/3 h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold">Inbox</h1>
          </div>
          <div className="p-4">
            <h2 className="text-xl font-bold">Messages</h2>
          </div>
        </div>
      </div>
    </>
  );
}
