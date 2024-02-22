import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";

export default function ConfigWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const { LL, locale } = useI18nContext();

  return (
    <div className="p-4 bg-primary-950 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-500 w-full flex flex-col justify-center">
      <h1 className="text-lg font-bold mb-1">{title}</h1>
      <p className="text-sm">{description}</p>
      <div className="mb-2" />
      {children}
    </div>
  );
}
