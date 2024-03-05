import React, { createContext, useContext, useEffect, useState } from "react";
import { edenTreaty } from "@elysiajs/eden";
import { App } from "../../backend/src/main";

export const BackendContext = createContext({} as BackendContextType);
export const useBackend = () => useContext(BackendContext);

// @ts-ignore
const instance = edenTreaty<App>(
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://chase-backend.dmun.de",
  {
    $fetch: {
      credentials: "include",
    },
  },
);
export type BackendInstanceType = typeof instance;

export const Backend = ({ children }: { children: React.ReactNode }) => {
  const [backend, setBackend] = useState<BackendInstanceType>(instance);

  useEffect(() => {
    setBackend(instance);
  }, [backend]);

  return (
    <BackendContext.Provider value={{ backend }}>
      {children}
    </BackendContext.Provider>
  );
};

export interface BackendContextType {
  backend: BackendInstanceType;
}
