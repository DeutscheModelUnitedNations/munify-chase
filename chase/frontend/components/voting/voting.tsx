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

export default function VotingArea() {
  const { LL } = useI18nContext();
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
      <WidgetTemplate cardTitle={LL.participants.voting.VOTING_HEADLINE()}>
        {!data ? (
          <NoDataPlaceholder title={LL.participants.voting.NO_DATA_VOTING()} />
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
