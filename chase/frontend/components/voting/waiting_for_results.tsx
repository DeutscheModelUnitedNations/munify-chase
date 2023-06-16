import React from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons/faCheckCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useI18nContext } from "@/src/i18n/i18n-react";

export default function WaitingForResults() {
  const { LL } = useI18nContext();

  return (
    <div className="my-4 shadow-md rounded-md p-4 bg-white flex justify-center items-center">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-lg">
          <FontAwesomeIcon icon={faCheckCircle} className="text-gray-icon" />
          <div className="text-gray-text font-bold">
            {LL.participants.voting.votingButtons.VOTE_REGISTERED()}
          </div>
        </div>
        <div className="text-sm text-gray-icon">
          {LL.participants.voting.votingButtons.VOTE_REGISTERED_MESSAGE()}
        </div>
      </div>
    </div>
  );
}
