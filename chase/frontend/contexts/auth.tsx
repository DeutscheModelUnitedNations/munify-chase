import React, { Key, createContext, useContext, useEffect } from "react";
import Keycloak from "keycloak-js";
import { OpenAPI } from "@/backend-client";

interface AuthContextType {
  token: () => Promise<string | undefined>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Returns the authentication context of the current user
 *
 * @return {object} The authentication context object
 * @throws {Error} Throws an error if used outside of an AuthProvider
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //TODO this is probably not the way to do this correctly, but its performant and clean enough for now
  const keycloak = (async () => {
    if (typeof window !== "undefined") {
      // only run in browser
      return new Keycloak({
        //TODO update this with prod values
        realm: "dmun",
        url: "http://localhost:6677",
        clientId: "chase",
      });
    }
  })() as Promise<Keycloak>; // in browsers this will allways be set  so we force the type here

  const initialize = (async () => {
    const k = await keycloak;
    if (typeof window !== "undefined") {
      // only run in browser
      await k.init({
        onLoad: "check-sso",
      });
    }
  })();

  const login = async () => {
    return (await keycloak).login(); // subsequent promise awaits dont delay the call
  };
  const logout = async () => {
    return (await keycloak).logout();
  };
  const token = async () => {
    // init first to ensure the token is set
    await initialize;
    return (await keycloak).token;
  };

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
