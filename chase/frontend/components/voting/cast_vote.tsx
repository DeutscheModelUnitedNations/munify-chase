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
import { useI18nContext } from "@/src/i18n/i18n-react";
import { set } from "react-hook-form";

export default function CastVote({
  votes,
  votingCountries,
  substantiveVote,
  outcome,
  myCountry,
}: Voting & { myCountry: CountryCode }) {
  const { LL } = useI18nContext();

  const [ableToVote, setAbleToVote] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const isInVotingCountries = votingCountries.includes(myCountry);
    const myVote = votes.find((vote) => vote.country === myCountry)?.vote;

    const isAbleToVote = isInVotingCountries && !myVote;
    const hasVoted = isInVotingCountries && myVote;

    setAbleToVote(isAbleToVote);
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
      {ableToVote && (voted ? (
        !outcome && (
          <div className="my-4 shadow-md rounded-md p-4 bg-white flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-lg">
                <FontAwesomeIcon icon={faCheckCircle} />
                <div>
                  {LL.participants.voting.votingButtons.VOTE_REGISTERED()}
                </div>
              </div>
              <div className="text-sm">
                {LL.participants.voting.votingButtons.VOTE_REGISTERED_MESSAGE()}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="my-4 shadow-md rounded-md p-4 bg-white flex justify-center items-center">
          <div className="flex justify-stretch items-center gap-4">
            <Button
              label={LL.participants.voting.votingButtons.IN_FAVOUR()}
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
                label={LL.participants.voting.votingButtons.ABSTENTION()}
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
              label={LL.participants.voting.votingButtons.AGAINST()}
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
      ))}
    </>
  );
}
