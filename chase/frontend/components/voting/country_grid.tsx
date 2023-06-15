import { CountryCode, Voting } from "@/custom_types";
import React, { useEffect, useState } from "react";
import { SmallFlag } from "../flag_templates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faHourglassHalf,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function CountryGrid({
  votes,
  votingCountries,
  substantiveVote,
}: Voting) {
  const [yesVotes, setYesVotes] = useState<CountryCode[]>([]);
  const [noVotes, setNoVotes] = useState<CountryCode[]>([]);
  const [abstainVotes, setAbstainVotes] = useState<CountryCode[]>([]);
  const [absentVotes, setAbsentVotes] = useState<CountryCode[]>([]);
  const [remainingVotes, setRemainingVotes] = useState<CountryCode[]>([]);

  useEffect(() => {
    const yesVotes = votes
      .filter((vote) => vote.vote === "yes")
      .map((vote) => vote.country);
    const noVotes = votes
      .filter((vote) => vote.vote === "no")
      .map((vote) => vote.country);
    const abstainVotes = votes
      .filter((vote) => vote.vote === "abstain")
      .map((vote) => vote.country);
    const absentVotes = votes
      .filter((vote) => vote.vote === "absent")
      .map((vote) => vote.country);
    const remainingVotes = votingCountries.filter(
      (country) =>
        !yesVotes.includes(country) &&
        !noVotes.includes(country) &&
        !abstainVotes.includes(country) &&
        !absentVotes.includes(country),
    );

    setYesVotes(yesVotes);
    setNoVotes(noVotes);
    setAbstainVotes(abstainVotes);
    setAbsentVotes(absentVotes);
    setRemainingVotes(remainingVotes);
  }, [votes]);

  return (
    <>
      {substantiveVote ? (
        <div className="flex-1 grid grid-cols-3 gap-2">
          <VotesCard
            category="Dafür"
            icon={faPlusCircle}
            color="text-green-700"
            votes={yesVotes}
          />
          <VotesCard
            category="Enthaltung"
            icon={faCircle}
            color="text-dmun"
            votes={abstainVotes}
          />
          <VotesCard
            category="Dagegen"
            icon={faMinusCircle}
            color="text-red-600"
            votes={noVotes}
          />
          {remainingVotes.length > 0 && (
            <VotesCard
              category="Ausstehend"
              icon={faHourglassHalf}
              color="text-black"
              votes={remainingVotes}
              colSpan={3}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 gap-2">
          <VotesCard
            category="Dafür"
            icon={faPlusCircle}
            color="text-green-700"
            votes={yesVotes}
          />
          <VotesCard
            category="Dagegen"
            icon={faMinusCircle}
            color="text-red-600"
            votes={noVotes}
          />
          {remainingVotes.length > 0 && (
            <VotesCard
              category="Ausstehend"
              icon={faHourglassHalf}
              color="text-black"
              votes={remainingVotes}
              colSpan={2}
            />
          )}
        </div>
      )}
    </>
  );
}

function VotesCard({
  category,
  icon,
  votes,
  color,
  colSpan,
}: {
  category: string;
  icon: IconProp;
  votes: CountryCode[];
  color: string;
  colSpan?: number;
}) {
  const colSpanClass = colSpan ? `span ${colSpan}` : "span 1";

  const categoryClasses = `font-bold ${color}`;

  return (
    <div
      className="flex-1 h-full flex flex-col justify-start gap-3 bg-white rounded-md p-2 transition-all duration-300 hover:shadow-sm"
      style={{ gridColumn: colSpanClass }}
    >
      <div className="flex justify-center items-center gap-3 text-lg">
        <FontAwesomeIcon icon={icon} className={color} />
        <div className={categoryClasses}>{category}</div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {votes.map((country) => (
          <div className="flex justify-center items-center">
            <SmallFlag countryCode={country} showNameOnHover />
          </div>
        ))}
      </div>
    </div>
  );
}
