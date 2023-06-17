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
import InformationSection from "@/components/voting/information_section";
import WaitingForResults from "@components/voting/waiting_for_results";
import { votingTestData as testData } from "@/test_data";
import { useI18nContext } from "@/src/i18n/i18n-react";
import FlipMove from "react-flip-move";

/**
 * This Component is the main Component of the Voting Area. It combines several other
 * Components like the InformationSection, the VotingBar, the CastVote Component, the CountryGrid, the Outcome
 * Component, and the WaitingForResults Component.
 * It also handles all the logic for the display of the different Components.
 * For example, it checks if the user's country is voting, if the user's country has already voted, and if the voting
 * is still ongoing. Based on these checks, it decides which Component to display.
 */

export default function VotingArea() {
  const { LL } = useI18nContext();
  const [data, setData] = useState<Voting>(testData);
  const [myCountryIsVoting, setMyCountryIsVoting] = useState<boolean>(false);
  const [myCountryHasVoted, setMyCountryHasVoted] = useState<boolean>(false);

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      setData(testData);

      if (data) {
        setMyCountryIsVoting(data.votingCountries.includes(myCountry));

        const myVote = data.votes.find(
          (vote) => vote.country === myCountry,
        )?.vote;
        setMyCountryHasVoted(!!myVote);
      }

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
              <div key="Header">
                <InformationSection {...data} />
              </div>
              {!myCountryHasVoted && myCountryIsVoting && (
                <div key="CastVote">
                  <CastVote myCountry={myCountry} {...data} />
                </div>
              )}
              {!data.outcome && myCountryHasVoted && (
                <div key="WaitingForResults">
                  <WaitingForResults />
                </div>
              )}
              {data.outcome && (
                <div key="Outcome">
                  <Outcome {...data} />
                </div>
              )}
              <div key="Bar">
                <VotingBar {...data} />
              </div>
              <div key="Grid">
                <CountryGrid {...data} />
              </div>
            </FlipMove>
          </ScrollPanel>
        )}
      </WidgetTemplate>
    </>
  );
}
