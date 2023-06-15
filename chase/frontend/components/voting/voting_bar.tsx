import React, { useEffect, useState } from "react";
import { Voting, VotingMajority } from "@/custom_types";

export default function VotingBar({
  votingCountries,
  votes,
  majority,
}: Voting) {
  const [yesVotesPercentage, setyesVotesPercentage] = useState<number>(0);
  const [noVotesPercentage, setnoVotesPercentage] = useState<number>(0);
  const [abstainVotesPercentage, setabstainVotesPercentage] =
    useState<number>(0);
  const [remainingVotesPercentage, setremainingVotesPercentage] =
    useState<number>(100);

  const countVotes = (key: string): number => {
    return votes.filter((vote) => vote.vote === key).length;
  };

  const countRemainingVotes = (): number => {
    return (
      votingCountries.length -
      countVotes("yes") -
      countVotes("no") -
      countVotes("abstain") -
      countVotes("absent")
    );
  };

  const countNonAbsentVotes = (): number => {
    return votingCountries.length - countVotes("absent");
  };

  useEffect(() => {
    const numberOfVotes = votingCountries.length - countVotes("absent");

    setyesVotesPercentage((countVotes("yes") / numberOfVotes) * 100);
    setnoVotesPercentage((countVotes("no") / numberOfVotes) * 100);
    setabstainVotesPercentage((countVotes("abstain") / numberOfVotes) * 100);
    setremainingVotesPercentage((countRemainingVotes() / numberOfVotes) * 100);
  }, [votes]);

  return (
    <div className="flex-1 relative flex w-full rounded-md shadow-md overflow-hidden">
      <VotingBarSection
        numberOfVotes={countVotes("yes")}
        percentage={yesVotesPercentage}
        color="green-700"
      />
      <div className="bg-white h-8 w-px" />
      <VotingBarSection
        numberOfVotes={countVotes("abstain")}
        percentage={abstainVotesPercentage}
        color="dmun"
      />
      <div className="bg-white h-8 w-px" />
      <VotingBarSection
        numberOfVotes={countVotes("no")}
        percentage={noVotesPercentage}
        color="red-600"
      />
      <VotingBarSection
        numberOfVotes={countRemainingVotes()}
        percentage={remainingVotesPercentage}
        color="white"
        hideCounter
      />
      <MajorityMarking
        majority={majority}
        numberOfVotes={countNonAbsentVotes()}
      />
    </div>
  );
}

function VotingBarSection({
  numberOfVotes,
  percentage,
  color,
  hideCounter = false,
}: {
  numberOfVotes: number;
  percentage: number;
  color: string;
  hideCounter?: boolean;
}) {
  let classNames =
    "flex justify-center items-center text-white h-8 transition-all duration-1000 ";
  if (color) {
    classNames += `bg-${color}`;
  }

  return (
    <div className={classNames} style={{ width: `${percentage}%` }}>
      {!hideCounter && numberOfVotes > 0 && (
        <div className="text-sm">{numberOfVotes}</div>
      )}
    </div>
  );
}

function MajorityMarking({
  majority,
  numberOfVotes,
}: { majority: VotingMajority; numberOfVotes: number }) {
  const getMajorityPercentage = (): number => {
    switch (majority) {
      case "simple":
        return 0.5;
      case "two-thirds":
        return 0.6667;
      case "three-quarters":
        return 0.75;
      case "consensus":
        return 1;
      case "security-council":
        return 9 / numberOfVotes - 0.01; // counteract ceiling of the number: -0.01 to round down (e.g. the security council majority of 15 votes is 9, not 10)
      default:
        return 0.5;
    }
  };

  const getVotingStepForMajority = (): number => {
    const majorityPercentage = getMajorityPercentage();
    const votesNeededForMajority = Math.ceil(
      numberOfVotes * majorityPercentage + 0.01, // +0.01 to round up (e.g. the simple majority of 10 votes is 6, not 5)
    );
    const percentagePosition = (votesNeededForMajority / numberOfVotes) * 100;

    return percentagePosition;
  };

  return (
    <div
      className="w-1 h-8 bg-black absolute -translate-x-px"
      style={{ left: `${getVotingStepForMajority()}%` }}
    />
  );
}
