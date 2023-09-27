import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Card from "@components/home/card";

export default function CardSection() {
  const { LL } = useI18nContext();

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full justify-stretch p-8 gap-4">
        <Card
          src="/undraw/candidate.svg"
          alt="Debate"
          header={LL.home.heroCards.CARD_1_TITLE()}
          text={LL.home.heroCards.CARD_1_TEXT()}
        />
        <Card
          src="/undraw/voting.svg"
          alt="Debate"
          header={LL.home.heroCards.CARD_2_TITLE()}
          text={LL.home.heroCards.CARD_2_TEXT()}
        />
        <Card
          src="/undraw/team_collaboration.svg"
          alt="Debate"
          header={LL.home.heroCards.CARD_3_TITLE()}
          text={LL.home.heroCards.CARD_3_TEXT()}
        />
      </div>
    </>
  );
}
