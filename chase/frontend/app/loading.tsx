"use client";
import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Loading() {
  const { LL } = useI18nContext();

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="flex flex-col justify-center items-center gap-10"
        role="status"
      >
        <div>
          <i
            className="pi pi-spin pi-spinner text-primary "
            style={{ fontSize: "3rem" }}
          />
        </div>
        <div>{LL.LOADING_PAGE()}</div>
      </div>
    </div>
  );
}
