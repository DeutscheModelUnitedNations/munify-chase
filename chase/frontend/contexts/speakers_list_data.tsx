"use client";
import { backend } from "@/services/backend";
import React, { createContext } from "react";

type SpeakersListData = Awaited<
  ReturnType<(typeof backend.speakersList)["speakersListId"]["get"]>
>["data"];

export const SpeakersListDataContext = createContext<SpeakersListData | null>(
  null,
);

export const SpeakersListIdContext = createContext<string | null>(null);
