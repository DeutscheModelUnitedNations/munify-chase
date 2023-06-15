import React, { useEffect, useState } from "react";
import { CountryCode, Voting } from "@/custom_types";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircle,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function CastVote({
  votes,
  votingCountries,
  substantiveVote,
  outcome,
  myCountry,
}: Voting & { myCountry: CountryCode }) {
  const [ableToVote, setAbleToVote] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const isInVotingCountries = votingCountries.includes(myCountry);
    const myVote = votes.find((vote) => vote.country === myCountry);

    const ableToVote = isInVotingCountries && !myVote;
    const hasVoted = isInVotingCountries && myVote;

    setAbleToVote(ableToVote);
    setVoted(() => {
      if (hasVoted) return true;
      else return false;
    });
  }, [votes, outcome]);

  const castVote = (vote: "yes" | "no" | "abstain") => {
    setVoted(true);
  };

  return (
    <>
      {ableToVote && voted ? (
        !outcome && (
          <div className="my-4 shadow-md rounded-md p-4 bg-white flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-lg">
                <FontAwesomeIcon icon={faCheckCircle} />
                <div>Auswahl bestätigt</div>
              </div>
              <div className="text-sm">Warte auf Ergebnisse</div>
            </div>
          </div>
        )
      ) : (
        <div className="my-4 shadow-md rounded-md p-4 bg-white flex justify-center items-center">
          <div className="flex justify-stretch items-center gap-4">
            <Button
              label="Dafür"
              style={{
                backgroundColor: "var(--voting-for)",
                color: "#fff",
                borderColor: "var(--voting-for)",
              }}
              icon={<FontAwesomeIcon icon={faPlusCircle} className="mr-3" />}
              onClick={() => {
                castVote("yes");
              }}
            />
            {substantiveVote && (
              <Button
                label="Enthaltung"
                style={{
                  backgroundColor: "var(--voting-abstain)",
                  color: "#fff",
                  borderColor: "var(--voting-abstain)",
                }}
                icon={<FontAwesomeIcon icon={faCircle} className="mr-3" />}
                onClick={() => {
                  castVote("abstain");
                }}
              />
            )}
            <Button
              label="Dagegen"
              style={{
                backgroundColor: "var(--voting-against)",
                color: "#fff",
                borderColor: "var(--voting-against)",
              }}
              icon={<FontAwesomeIcon icon={faMinusCircle} className="mr-3" />}
              onClick={() => {
                castVote("no");
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
