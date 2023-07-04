import React, { createContext, useContext, useState } from "react";
import { API, DefaultService, OpenAPI } from "@/backend-client";
import { useAuth } from "./auth";

const BackendContext = createContext<DefaultService | undefined>(undefined);

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

  OpenAPI.BASE = "http://localhost:3001"; //TODO adjust to prod values
  OpenAPI.CREDENTIALS = "same-origin";
  OpenAPI.WITH_CREDENTIALS = true;

  // this should be a resolver function since the token state might change throughout the application state
  // ignore type checking here since undefined would equal not setting the value
  // @ts-ignore
  OpenAPI.TOKEN = auth.token;

  const [backend, _] = useState(new API(OpenAPI));

  return (
    <BackendContext.Provider value={backend.default}>
      {children}
    </BackendContext.Provider>
  );
};

export { BackendProvider, useBackend };
