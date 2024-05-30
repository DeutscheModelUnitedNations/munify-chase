"use client";
import { useQuery } from "@/gqty";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const BackendTimeContext = createContext({} as BackendTimeContextType);
export const useBackendTime = () => useContext(BackendTimeContext);

export const BackendTime = ({ children }: { children: React.ReactNode }) => {
  const { serverTime } = useQuery();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const backendTimestamp = serverTime ?? new Date(Date.now()); // in case we are not logged in we fall back to our own time
    const ourTimestamp = new Date();
    const offset = backendTimestamp.getTime() - ourTimestamp.getTime();

    const interval = setInterval(() => {
      const newTime = new Date(new Date().getTime() + offset);
      setCurrentTime(newTime);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <BackendTimeContext.Provider value={{ currentTime }}>
      {children}
    </BackendTimeContext.Provider>
  );
};

export interface BackendTimeContextType {
  currentTime: Date;
}
