"use client";
import React from "react";
import Navbar from "@/components/navbar/navbar";

export default function participant_dashboard() {
  return (
    <>
      <Navbar active={{ index: 1, path: "/participant/speakers" }} />
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h1 className="text-3xl font-bold">Speakers List</h1>
      </div>
    </>
  );
}
