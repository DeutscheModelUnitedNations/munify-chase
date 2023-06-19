import React from "react";
import { Voting } from "@/custom_types";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons/faXmarkCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useI18nContext } from "@/i18n/i18n-react";


export default function VotingBar({ outcome }: Voting) {
  /**
   * This Component is used in the Voting Component.
   * It displays the outcome of the voting.
   * It is only displayed, when the outcome variable is set by the server.
   * It displays a green checkmark, when the vote was successful.
   * It displays a red X, when the vote failed.
   */

  const { LL } = useI18nContext();

  return (
    <>
      {outcome && (
        outcome === "passed" ? (
        <div className="shadow-md rounded-md p-4 bg-green-700 text-white flex justify-center items-center">
            <div className="flex items-center gap-2 text-lg">
              <FontAwesomeIcon icon={faCheckCircle} />
            <div>{LL.participants.voting.votingResults.VOTING_SUCCESSFUL()}</div>
            </div>
          </div>
        ) : (
          <div className="my-4 shadow-md rounded-md p-4 bg-red-600 text-white flex justify-center items-center">
            <div className="flex items-center gap-2 text-lg">
              <FontAwesomeIcon icon={faXmarkCircle} />
              <div>{LL.participants.voting.votingResults.VOTING_FAILED()}</div>
            </div>
          </div>
        )
      )}
    </>
  )
}