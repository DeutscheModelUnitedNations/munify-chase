"use client";
import React from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import Loading from "./loading";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
          <div className="p-buttonset">
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
