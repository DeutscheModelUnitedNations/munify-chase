"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import Loading from "./loading";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Suspense fallback={<Loading />} />
      <Toast ref={linkRedirectingToast} />
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
            <Link href="/login/participant">
              <Button
                label="Teilnehmenden-Login"
                icon="pi pi-link"
              />
            </Link>
            <Link href="/login/chair">
              <Button
                label="Vorsitz-Login"
                icon="pi pi-link"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
