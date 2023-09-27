"use client";
import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Navbar from "@/components/home/navbar";
import LandingHero from "@/components/home/landing_hero";
import CardSection from "@/components/home/card_section";
import TextSection from "@/components/home/text_section";
import { faCodeBranch, faExternalLink } from "@fortawesome/pro-solid-svg-icons";
import Footer from "@/components/home/footer";

export default function Home() {
  const { LL } = useI18nContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-primary-950">
        <LandingHero />
        <CardSection />
        <div
          className="flex flex-col lg:flex-none lg:grid gap-2 lg:gap-10 p-4 lg:p-20 align-items-start"
          style={{
            gridTemplateColumns: "auto 1fr",
          }}
        >
          <TextSection
            title={LL.home.ABOUT_TITEL()}
            text={LL.home.ABOUT_TEXT()}
          />
          <TextSection
            title={LL.home.MISSION_TITLE()}
            text={LL.home.MISSION_TEXT()}
            button={{
              lable: LL.home.MISSION_BUTTON_LABEL(),
              link: "https://www.dmun.de/",
              faIcon: faExternalLink,
            }}
          />
          <TextSection
            title={LL.home.CONTRIBUTE_TITEL()}
            text={LL.home.CONTRIBUTE_TEXT()}
            button={{
              lable: LL.home.CONTRIBUTE_BUTTON_LABEL(),
              link: "https://github.com/DeutscheModelUnitedNations/munify",
              faIcon: faCodeBranch,
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
