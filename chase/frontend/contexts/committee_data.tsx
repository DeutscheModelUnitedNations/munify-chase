"use client";
import { backend } from "@/services/backend";
import React, { createContext } from "react";

type SpeakersListData = Awaited<ReturnType<typeof backend.speakersList["speakersListId"]["get"]>>["data"];

export const ConferenceIdContext = createContext<string | null>(null);
export const CommitteeIdContext = createContext<string | null>(null);

