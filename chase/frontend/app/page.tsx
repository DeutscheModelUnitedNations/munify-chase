"use client";
import React from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { useBackend } from "@/contexts/backend";
import { useAuth } from "@/contexts/auth";

export default function Home() {
  const router = useRouter();
  const auth = useAuth();
  const backend = useBackend();

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
              label="Login ZITADEL"
              icon="pi pi-link"
              onClick={auth.login}
            />
            <Button
              label="TEST"
              icon="pi pi-link"
              onClick={() => backend["sign-in"].post()}
            />
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
        </div>
      </div>
    </>
  );
}
