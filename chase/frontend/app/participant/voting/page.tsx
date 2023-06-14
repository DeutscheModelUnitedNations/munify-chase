"use client";
import React from "react";
import Motions from "@/components/voting/motions";
import VotingArea from "@/components/voting/voting";

export default function participant_dashboard() {
  return (
    <>
      <div className="flex-1 flex p-4 gap-4 flex-col lg:flex-row">
        <div className="w-full lg:w-1/3 flex">
          <Motions />
        </div>
        <div className="w-full lg:w-2/3 flex">
          <VotingArea />
        </div>
      </div>
    </>
  );
}
