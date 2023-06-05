"use client";
import React from "react";
import Navbar from "@/components/navbar/navbar";

export default function participant_dashboard() {
  return (
    <>
      <Navbar active={{ index: 2, path: "/participant/resolutions" }} />
      <div className="flex-1 flex flex-col justify-center items-center w-full">
        <h1 className="text-3xl font-bold">Resolutions</h1>
      </div>
    </>
  );
}
