"use client";
import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";

export default function Loading() {
  const { LL } = useI18nContext();

  return (
    <div className="flex justify-center items-center h-screen dark:bg-primary-100">
      <div
        className="flex flex-col justify-center items-center gap-10"
        role="status"
      >
        <div>
          <i
            className="pi pi-spin pi-spinner text-primary dark:text-primary-900"
            style={{ fontSize: "3rem" }}
          />
        </div>
        <div className="text-primary-100 dark:text-primary-900">
          {LL.LOADING_PAGE()}
        </div>
      </div>
    </div>
  );
}
