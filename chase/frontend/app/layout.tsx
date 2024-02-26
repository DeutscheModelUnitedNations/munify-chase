"use client";
import "./globals.scss";
import { Inter } from "next/font/google"; // Even though Google Fonts are used – no requests are sent to Google (see NEXT.JS docs)

import { PrimeReactProvider } from "primereact/api";
import Tailwind from "primereact/passthrough/tailwind";
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
import Button from "@/components/button";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";
import CookieBanner from "@/components/cookie_banner";

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
        {/* <PrimeReactProvider value={{ pt: Tailwind }}> */}
        <TypesafeI18n locale={locale}>
          <ToastProvider>
            <CookieBanner />
            {children}
          </ToastProvider>
        </TypesafeI18n>
        {/* </PrimeReactProvider> */}
      </body>
    </html>
  );
}
