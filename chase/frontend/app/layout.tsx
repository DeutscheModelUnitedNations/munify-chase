"use client";

import "./globals.scss";
import { Inter } from "next/font/google"; // TODO Remove Google Fonts and use local fonts (legal reasons)

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";
import { detectLocale, navigatorDetector } from "typesafe-i18n/detectors";
import { loadLocale } from "@/src/i18n/i18n-util.sync";
import { baseLocale, locales } from "@/src/i18n/i18n-util";
import TypesafeI18n from "@/src/i18n/i18n-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // https://github.com/ivanhofer/typesafe-i18n/tree/main/packages/detectors)
  const locale = detectLocale(baseLocale, locales, navigatorDetector);
  loadLocale(locale);

  return (
    <TypesafeI18n locale={locale}>
      <html lang="de">
        <body className={inter.className}>{children}</body>
      </html>
    </TypesafeI18n>
  );
}
