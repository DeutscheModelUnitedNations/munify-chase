import React, { useEffect, useState } from "react";
import { CountryCode, Voting } from "@/custom_types";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function CastVote({
  votes,
  votingCountries,
  substantiveVote,
  outcome,
  myCountry
}: Voting & { myCountry: CountryCode }) {

  const [ableToVote, setAbleToVote] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const isInVotingCountries = votingCountries.includes(myCountry);
    const myVote = votes[myCountry];

    const ableToVote = isInVotingCountries && !myVote;
    const hasVoted = isInVotingCountries && myVote;

    setAbleToVote(ableToVote);
    setVoted(() => {
      if (hasVoted) return true;
      else return false;
    });
  }, [votes, outcome]);


  return (
    <>
      {ableToVote && voted ? (
        !outcome &&
          <div className="my-4 shadow-md rounded-md p-4 bg-white flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-lg">
                <FontAwesomeIcon icon={faCheckCircle} />
                <div>Auswahl bestätigt</div>
              </div>
              <div className="text-sm">Warte auf Ergebnisse</div>
            </div>
          </div>
        ) : (
          <div className="my-4 shadow-md rounded-md p-4 bg-white flex justify-center items-center">
            <div className="flex justify-stretch items-center gap-4">
              <Button
                label="Dafür"
                onClick={() => {
                  votes[myCountry] = "yes";
                  setVoted(true);
                  // TODO send vote to backend
                }}
              />
              {substantiveVote && (
                <Button
                  label="Enthaltung"
                  className="p-button-secondary"
                  onClick={() => {
                    votes[myCountry] = "abstain";
                    setVoted(true);
                    // TODO send vote to backend
                  }}
                />
              )}
              <Button
                label="Dagegen"
                className="p-button-danger"
                onClick={() => {
                  votes[myCountry] = "no";
                  setVoted(true);
                  // TODO send vote to backend
                }}
              />
            </div>
          </div>
      )}
    </>
  )
}