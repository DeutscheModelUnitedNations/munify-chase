import React, { createContext, useContext, useState } from "react";
import { edenTreaty } from "@elysiajs/eden";
import { App } from "../../backend/src/main";
import { unstable_noStore as noStore } from "next/cache";
import { env } from "next-runtime-env";

export const BackendContext = createContext({} as BackendContextType);
export const useBackend = () => useContext(BackendContext);

//@ ts-ignore
export type BackendInstanceType = ReturnType<typeof edenTreaty<App>>;

// TODO
function getBackendUrl() {
  noStore();
  return env("NEXT_PUBLIC_BACKEND_URL") || "https://chase-backend.dmun.de";
}

export const Backend = ({ children }: { children: React.ReactNode }) => {
  const [backend, _setBackend] = useState(
    //@ts-ignore
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
