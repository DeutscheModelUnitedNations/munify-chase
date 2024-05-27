"use client";
import { WebStorageStateStore } from "oidc-client-ts";
import type React from "react";
import { useEffect, useState } from "react";
import { AuthProvider, hasAuthParams, useAuth } from "react-oidc-context";

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider
      authority="http://localhost:8080"
      client_id="issuer1"
      redirect_uri="http://localhost:3000/test"
      automaticSilentRenew={true}
      onSigninCallback={() => {
        //TODO
        console.log("Signin callback called");
      }}
      userStore={
        typeof window !== "undefined"
          ? new WebStorageStateStore({ store: window.localStorage })
          : undefined
      }
    >
      <Auth>{children}</Auth>
    </AuthProvider>
  );
}

function Auth({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const [hasTriedSignin, setHasTriedSignin] = useState(false);

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      !hasTriedSignin
    ) {
      auth.signinRedirect();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  return children;
}
