"use client";

import React, { createContext, useContext, useEffect } from "react";
import Keycloak from "keycloak-js";

//TODO update this with prod values
const keycloak = new Keycloak({
  realm: "dmun",
  url: "http://localhost:6677",
  clientId: "chase",
});

interface AuthContextType {
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Returns the authentication context of the current user.
 *
 * @return {object} The authentication context object.
 * @throws {Error} Throws an error if used outside of an AuthProvider.
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const login = keycloak.login;
  const logout = keycloak.logout;

  const [authenticated, setAuthenticated] = React.useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await keycloak.init({
        onLoad: "check-sso",
      });
      setAuthenticated(keycloak.authenticated ?? false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
