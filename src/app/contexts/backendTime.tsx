"use client";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthorizedQuery } from "../hooks/gqty/useAuthorizedQuery";

export const BackendTimeContext = createContext({} as BackendTimeContextType);
export const useBackendTime = () => useContext(BackendTimeContext);

export const BackendTime = ({ children }: { children: React.ReactNode }) => {
  const { serverTime } = useAuthorizedQuery();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    if (serverTime) {
      const serverDate = new Date(serverTime);
      const clientDate = new Date();
      const calculatedOffset = serverDate.getTime() - clientDate.getTime();
      setOffset(calculatedOffset);
      // Set the initial current time based on the offset
      setCurrentTime(new Date(clientDate.getTime() + calculatedOffset));
    }
  }, [serverTime]);

  useEffect(() => {
    if (offset !== null) {
      const interval = setInterval(() => {
        setCurrentTime(new Date(new Date().getTime() + offset));
      }, 500); // 60000 ms = 1 minute

      return () => clearInterval(interval);
    }
  }, [offset]);

  return (
    <BackendTimeContext.Provider value={{ currentTime }}>
      {children}
    </BackendTimeContext.Provider>
  );
};

export interface BackendTimeContextType {
  currentTime: Date;
}
