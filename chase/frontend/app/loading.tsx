"use client";
import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="flex flex-col justify-center items-center gap-10"
        role="status"
      >
        <div>
          <i
            className="pi pi-spin pi-spinner fg-dmun-primary"
            style={{ fontSize: "3rem" }}
          />
        </div>
        <div className="">Loading</div>
      </div>
    </div>
  );
}
