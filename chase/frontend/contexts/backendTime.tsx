import { useBackend } from "./backend";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const BackendTimeContext = createContext({} as BackendTimeContextType);
export const useBackendTime = () => useContext(BackendTimeContext);

export const BackendTime = ({ children }: { children: React.ReactNode }) => {
  //@ts-ignore
  const { backend } = useBackend();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // biome-ignore lint/suspicious/noExplicitAny: timer type
    let interval: any;
    backend.timestamp.get().then((res) => {
      if (res.status !== 200) {
        throw new Error("Failed to get timestamp");
      }

      const backendTimestamp = new Date(res.data);
      const ourTimestamp = new Date();
      const offset = backendTimestamp.getTime() - ourTimestamp.getTime();

      interval = setInterval(() => {
        const newTime = new Date(new Date().getTime() + offset);
        setCurrentTime(newTime);
      }, 500);
    });
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
