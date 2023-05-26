"use client";
import React from "react";

//TODO maybe a centralized spinner and a nice text would fit here
export default function Loading() {
  return (
    <div className="flex flex-col justify-center align-center">
      <h1>Chase</h1>
      <p>Loading...</p>
    </div>
  );
}
