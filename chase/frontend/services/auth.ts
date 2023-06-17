import { createContext } from "react";
import Keycloak from "keycloak-js";
import { backend } from "@/backend-client";

// //TODO these must be exchanged in production for the real values
const keycloak = new Keycloak({
  realm: "dmun",
  url: "http://localhost:6677",
  clientId: "chase",
});

const auth = {
  authenticated: false,
  login,
  logout,
};

(async () => {
  keycloak.init({});
  auth.authenticated = keycloak.authenticated ?? false;
})();

/**
 * Authenticate the user at the auth provider
 * ATTENTION: This redirects the user away from the page until the auth workflow has completed
 */
export async function login() {
  await keycloak.login();
}

/**
 * Log the user out, destroying their session
 * ATTENTION: This redirects the user away from the page until the auth workflow has completed
 */
export async function logout() {
  await keycloak.logout();
}
