import React, { useEffect, useState } from "react";
import WidgetTemplate from "../widget_template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NoDataPlaceholder from "../no_data_placeholder";
import { CountryCode, Voting } from "@/custom_types";
import { LargeFlag } from "../flag_templates";
import { faFileContract, faFlag, faGavel, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import VotingBar from "@components/voting/voting_bar";
import CastVote from "@components/voting/cast_vote";
import CountryGrid from "@components/voting/country_grid";
import { ScrollPanel } from "primereact/scrollpanel";
import { myCountry } from "@/test_data";
import Outcome from "@components/voting/outcome";
import Header from "@components/voting/header";


export default function VotingArea() {
  const testData: Voting = {
    votingId: "1",
    title: "Informelle Sitzung von 15 Minuten",
    description: "Sollte der Antrag angenommen werden, wird das Gremium in eine informelle Sitzung übergehen, die 15 Minuten dauern wird.",
    introducedBy: "cpv",
    substantiveVote: true,
    votingCountries: ["cpv", "deu", "fra", "chn", "rus", "usa", "gbr", "jpn", "cmr", "alb", "arm"],
    majority: "simple",
    votes: {
      deu: "yes",
      fra: "no",
      chn: "yes",
      rus: "yes",
      usa: "yes",
      gbr: "abstain",
      jpn: "yes",
      alb: "no",
      arm: "yes",
    },
    outcome: "passed",
  }

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