"use client";
import { useAuth } from "react-oidc-context";

export default () => {
  const auth = useAuth();

  return <h1>{auth.isAuthenticated ? "true" : "false"}</h1>;
};
