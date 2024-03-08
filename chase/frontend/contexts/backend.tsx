import React, { createContext, useContext, useState } from "react";
import { edenTreaty } from "@elysiajs/eden";
import { App } from "../../backend/src/main";
import { unstable_noStore as noStore } from "next/cache";

export const BackendContext = createContext({} as BackendContextType);
export const useBackend = () => useContext(BackendContext);

export type BackendInstanceType = ReturnType<typeof edenTreaty<App>>;

//TODO
function getBackendUrl() {
  noStore();
  return process.env.BACKEND_URL || "https://chase-backend.dmun.de";
  // return process.env.BACKEND_URL || "http://localhost:3001";
}

export const Backend = ({ children }: { children: React.ReactNode }) => {
  const [backend, _setBackend] = useState(
    edenTreaty<App>(getBackendUrl(), {
      $fetch: {
        credentials: "include",
      },
    }),
  );

  return (
    <BackendContext.Provider value={{ backend }}>
      {children}
    </BackendContext.Provider>
  );
};

export interface BackendContextType {
  backend: BackendInstanceType;
}
