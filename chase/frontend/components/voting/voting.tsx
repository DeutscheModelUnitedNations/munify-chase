import React, { useEffect, useState } from "react";
import WidgetTemplate from "../widget_template";
import NoDataPlaceholder from "../no_data_placeholder";
import { Voting } from "@/custom_types";
import VotingBar from "@components/voting/voting_bar";
import CastVote from "@components/voting/cast_vote";
import CountryGrid from "@components/voting/country_grid";
import { ScrollPanel } from "primereact/scrollpanel";
import { myCountry } from "@/test_data";
import Outcome from "@components/voting/outcome";
import Header from "@components/voting/header";
import { votingTestData as testData } from "@/test_data";
import { useI18nContext } from "@/src/i18n/i18n-react";
import FlipMove from "react-flip-move";

export default function VotingArea() {
  const { LL } = useI18nContext();
  const [data, setData] = useState<Voting>(testData);
  const [testOutcome, setTestOutcome] = useState<string | null>(null)

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      setData(testData);
      setTestOutcome("passed")
      console.log("polling");
    }, 3000);
    return () => clearInterval(pollingInterval);
  }, []);

  return (
    <>
      <WidgetTemplate cardTitle={LL.participants.voting.VOTING_HEADLINE()}>
        {!data ? (
          <NoDataPlaceholder title={LL.participants.voting.NO_DATA_VOTING()} />
        ) : (
          <ScrollPanel className="w-full h-full">
            <FlipMove duration={1000} className="flex flex-col gap-2">
                <div key="Header"><Header {...data} /></div>
                <div key="CastVote"><CastVote myCountry={myCountry} {...data} /></div>
                {testOutcome && <div key="Outcome"><Outcome {...data} /></div>}
                <div key="Bar"><VotingBar {...data} /></div>
                <div key="Grid"><CountryGrid {...data} /></div>
            </FlipMove>
          </ScrollPanel>
        )}
      </WidgetTemplate>
    </>
  );
}
