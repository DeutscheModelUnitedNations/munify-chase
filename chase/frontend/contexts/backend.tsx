import React, { createContext, useContext, useState } from "react";
<<<<<<< HEAD
import { useAuth } from "./auth";
import { edenTreaty } from "@elysiajs/eden";
import type { App } from "../../backend/src/main";

// @ts-ignore
let client = edenTreaty<App>("http://localhost:3001");
const BackendContext = createContext(client);
=======
import { API, DefaultService, OpenAPI } from "@/backend-client";
import { useAuth } from "./auth";

const BackendContext = createContext<DefaultService | undefined>(undefined);
>>>>>>> main

/**
 * Returns the backend context for calling the api
 *
 * @return {object} The client to call the api
 * @throws {Error} Throws an error if used outside of a BackendProvider
 */
function useBackend() {
  const context = useContext(BackendContext);
  if (!context) {
    throw new Error(
      "useBackendClient must be used within an BackendContextProvider",
    );
  }
  return context;
}

const BackendProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();

  //TODO adjust to prod values
  // @ts-ignore
  client = edenTreaty<App>("http://localhost:3001", {
    async fetcher(input, init) {
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${await auth.access_token()}`,
          "authorization-id-token":
            (await auth.id_token()) ?? (undefined as unknown as string),
        },
        credentials: "same-origin",
      });
    },
  }); //TODO replace with real value

  const [backend, _] = useState(client);

  return (
    // rome-ignore lint/suspicious/noExplicitAny: typesyript cant detect the actual type here
    <BackendContext.Provider value={backend as any}>
      {children}
    </BackendContext.Provider>
  );
};

export { BackendProvider, useBackend };
