import { CountryCode, Voting } from "@/custom_types";
import React, { useEffect, useState } from "react";
import { SmallFlag } from "../flag_templates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faHourglassHalf, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function CountryGrid({ votes, votingCountries, substantiveVote } : Voting) {
  const [yesVotes, setYesVotes] = useState<CountryCode[]>([]);
  const [noVotes, setNoVotes] = useState<CountryCode[]>([]);
  const [abstainVotes, setAbstainVotes] = useState<CountryCode[]>([]);
  const [absentVotes, setAbsentVotes] = useState<CountryCode[]>([]);
  const [remainingVotes, setRemainingVotes] = useState<CountryCode[]>([]);

  useEffect(() => {
    // TODO fix types
    const voteEntries = Object.entries(votes);
    // @ts-ignore
    setYesVotes(voteEntries.filter(([_, vote]) => vote === "yes").map(([country]) => country));
    // @ts-ignore
    setNoVotes(voteEntries.filter(([_, vote]) => vote === "no").map(([country]) => country));
    // @ts-ignore
    setAbstainVotes(voteEntries.filter(([_, vote]) => vote === "abstain").map(([country]) => country));
    // @ts-ignore
    setAbsentVotes(voteEntries.filter(([_, vote]) => vote === "absent").map(([country]) => country));
    setRemainingVotes(votingCountries.filter((country) => !voteEntries.map(([code]) => code).includes(country)));
  }, [votes]);


  return (
    <>
      {substantiveVote ? (
      <div className="flex-1 grid grid-cols-3 gap-2">
        <VotesCard category="Dafür" icon={faPlusCircle} color="text-green-700" votes={yesVotes} />
        <VotesCard category="Enthaltung" icon={faCircle} color="text-gray-400" votes={abstainVotes} />
        <VotesCard category="Dagegen" icon={faMinusCircle} color="text-red-600" votes={noVotes} />
        {remainingVotes.length > 0 && ( 
            <VotesCard category="Ausstehend" icon={faHourglassHalf} color="text-black" votes={remainingVotes} colSpan={3} />
        )}
      </div>
      ) : (
      <div className="flex-1 grid grid-cols-2 gap-2">
        <VotesCard category="Dafür" icon={faPlusCircle} color="text-green-700" votes={yesVotes} />
        <VotesCard category="Dagegen" icon={faMinusCircle} color="text-red-600" votes={noVotes} />
        {remainingVotes.length > 0 && ( 
          <VotesCard category="Ausstehend" icon={faHourglassHalf} color="text-black" votes={remainingVotes} colSpan={2} />
        )}
      </div>)}
    </>
  )
}


function VotesCard ({category, icon, votes, color, colSpan} : {category: string, icon: IconProp, votes: CountryCode[], color: string, colSpan?: number}) {
  let colSpanClass = "";
  if (colSpan) {
    colSpanClass = " col-span-";
    colSpanClass += colSpan.toString();
  }

  return (
    <div className={("flex-1 h-full flex flex-col justify-start gap-3 bg-white rounded-md p-2 transition-all") + colSpanClass}>
      <div className="flex justify-center items-center gap-3 text-lg">
        <FontAwesomeIcon icon={icon} className={color}/>
        <div className={("font-bold ") + color}>{category}</div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {votes.map((country) => (
          <div className="flex justify-center items-center">
            <SmallFlag countryCode={country} showNameOnHover />
          </div>
        ))}
      </div>
    </div>
  )
}