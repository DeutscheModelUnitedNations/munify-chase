import React from "react";
import { Voting } from "@/custom_types";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons/faXmarkCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function VotingBar({ outcome }: Voting) {
    return (
        <>
          {outcome && (
            outcome === "passed" ? (
            <div className="my-4 shadow-md rounded-md p-4 bg-green-700 text-white flex justify-center items-center">
                <div className="flex items-center gap-2 text-lg">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <div>Abstimmung erfolgreich</div>
                </div>
              </div>
            ) : (
              <div className="my-4 shadow-md rounded-md p-4 bg-red-600 text-white flex justify-center items-center">
                <div className="flex items-center gap-2 text-lg">
                  <FontAwesomeIcon icon={faXmarkCircle} />
                  <div>Abstimmung abgelehnt</div>
                </div>
              </div>
            )
          )}
        </>
    )
}