"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { AuthProvider, hasAuthParams, useAuth } from "react-oidc-context";
import { BackendTime } from "../contexts/backendTime";
import { env } from "next-runtime-env";
import { usePathname, useSearchParams } from "next/navigation";

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider
      authority={env("NEXT_PUBLIC_OIDC_AUTHORITY")}
      client_id={env("NEXT_PUBLIC_OIDC_CLIENT")}
      // TODO real navigation target
      redirect_uri={`${typeof window !== "undefined" ? window.origin : ""}/${usePathname()}?${useSearchParams()}`}
      automaticSilentRenew={true}
      onSigninCallback={() => {
        //TODO
        console.log("Signin callback called");
      }}
    >
      <Auth>
        <BackendTime>{children}</BackendTime>
      </Auth>
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

  if (auth.isLoading) {
    return <div>Signing you in/out...</div>;
  }

  if (!auth.isAuthenticated) {
    return <div>Unable to log in</div>;
  }

  return children;
}
