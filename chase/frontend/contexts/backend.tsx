"use client";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { treaty } from "@elysiajs/eden";
import type { Api } from "../../backend/src/api";
import { unstable_noStore as noStore } from "next/cache";
import { env } from "next-runtime-env";
import { useDisconnectWarning } from "./disconnectWarning";

export const BackendContext = createContext({} as BackendContextType);
export const useBackend = () => useContext(BackendContext);

export type BackendInstanceType = ReturnType<typeof treaty<Api>>;

function getBackendUrl() {
  noStore();
  return env("NEXT_PUBLIC_BACKEND_URL") || "https://chase-backend.dmun.de";
}

export const Backend = ({ children }: { children: React.ReactNode }) => {
  const { setDisconnectWarning } = useDisconnectWarning() ?? {setDisconnectWarning: () => {}};

  // ATTENTION: It is IMPORTANT to use a callback function here to prevent
  // react from doing funky things with the backend instance when passing to the state hook
  // please do not ask me why this is happening...
  const [backend, _setBackend] = useState(() =>
    treaty<Api>(getBackendUrl(), {
      async fetcher(input: RequestInfo | URL, init?: RequestInit | undefined) {
        const i: RequestInit = init ?? {};
        i.credentials = "include";
        try {
          const r = await fetch(input, init);
          console.log(r.status, r.statusText, r.url);
          setDisconnectWarning(false);
          return r;
        } catch (error) {
          // if the fetch fails because of a network error, we don't throw an error
          // but return a response object with status 0
          console.log("Network error", error)
          setDisconnectWarning(true);
          return new Response(null, { status: 200 });
        }
      },
    }),
  );

  if (typeof window !== "undefined") {
    window.onerror = (message, source, lineno, colno, error) => {
      backend["report-error"].post({
        colno,
        error,
        lineno,
        message,
        source,
      });
    };
  }

  return (
    <BackendContext.Provider value={{ backend }}>
      {children}
    </BackendContext.Provider>
  );
};

export interface BackendContextType {
  backend: BackendInstanceType;
}
