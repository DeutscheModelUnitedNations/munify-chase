"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useBackend } from "@/contexts/backend";
import { useAuth } from "@/contexts/auth";

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const backend = useBackend();

  const [backendAcceptsOurAuth, setBackendAcceptsOurAuth] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") return;
        await backend.postApiConferenceCreate({
          body: {
            conference: {
              name: "test conference",
            },
            token: "1234",
          },
        });
        setBackendAcceptsOurAuth(true);
      } catch (_) {
        setBackendAcceptsOurAuth(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="flex align-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo/png/chase_logo_blue_text.png"
            alt="Logo"
            width={700}
            height={128}
            className="mb-10"
          />
          <div className="p-buttonset mb-2">
            <Button
              label="Teilnehmenden-Login"
              icon="pi pi-link"
              onClick={() => router.push("/login/participant")}
            />
            <Button
              label="Vorsitz-Login"
              icon="pi pi-link"
              onClick={() => router.push("/login/chair")}
            />
          </div>
          <span>
            backendAcceptsOurAuth:
            {backendAcceptsOurAuth && "yes"}
            {!backendAcceptsOurAuth && "nonono"}
          </span>
          <span>
            authenticated:
            {auth.authenticated && "yes"}
            {!auth.authenticated && "nonono"}
          </span>
          <div className="p-buttonset">
            <Button
              label="Zitadel login"
              icon="pi pi-link"
              onClick={() => auth.login()}
            />
            <Button
              label="Zitadel logout"
              icon="pi pi-link"
              onClick={() => auth.logout()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
