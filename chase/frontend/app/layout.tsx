"use client";
import "./globals.scss";
import { Inter } from "next/font/google"; // Even though Google Fonts are used – no requests are sent to Google (see NEXT.JS docs)

//theme
import "@/themes/theme_light.scss";
import "@/themes/theme_dark.scss";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above, otherwise icons will be huge on load

import Head from "next/head";

import {
  detectLocale,
  navigatorDetector,
  localStorageDetector,
} from "typesafe-i18n/detectors";
import { loadLocale } from "@/i18n/i18n-util.sync";
import { baseLocale, locales } from "@/i18n/i18n-util";
import TypesafeI18n from "@/i18n/i18n-react";
import { ToastProvider } from "@/contexts/toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isBrowser = typeof window !== "undefined";
  let locale = baseLocale;

  if (isBrowser) {
    // Only run this code in a browser context.
    locale = detectLocale(
      baseLocale,
      locales,
      localStorageDetector,
      navigatorDetector,
    );
  }

  loadLocale(locale);

  return (
    <html lang="en">
      <Head>
        <title>Chase</title> {/* TODO Make title work */}
      </Head>
      <body className={inter.className}>
        <TypesafeI18n locale={locale}>
          <ToastProvider>{children}</ToastProvider>
        </TypesafeI18n>
      </body>
    </html>
  );
}
