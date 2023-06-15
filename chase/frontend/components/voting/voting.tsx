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

export default function VotingArea() {
  const [data, setData] = useState<Voting>(testData);

  useEffect(() => {
    const pollingInterval = setInterval(() => {
      setData(testData);
      console.log("polling");
    }, 1000);
    return () => clearInterval(pollingInterval);
  }, []);

  return (
    <>
      <WidgetTemplate cardTitle="Abstimmungen">
        {!data ? (
          <NoDataPlaceholder title="Keine laufenden Abstimmungen" />
        ) : (
          <ScrollPanel className="w-full h-full">
            <div className="flex flex-col gap-2">
              <Header {...data} />
              <CastVote myCountry={myCountry} {...data} />
              <Outcome {...data} />
              <VotingBar {...data} />
              <CountryGrid {...data} />
            </div>
          </ScrollPanel>
        )}
      </WidgetTemplate>
    </>
  );
}
