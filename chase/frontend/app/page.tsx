"use client";
import React, { Suspense, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Loading from "./loading";

export default function Home() {
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [loadingChairs, setLoadingChairs] = useState(false);

  const linkRedirectingToast = useRef(null);

  const showLinkRedirectingToast = () => {
    linkRedirectingToast.current.show({
      severity: "info",
      summary: "Redirecting...",
      detail: "You will be redirected to the login page.",
    });
  };

  function loadParticipants() {
    setLoadingParticipants(true);

    // show toast
    showLinkRedirectingToast();

    // navigate to the participant login page
    setTimeout(() => {
      window.location.href = "/login/participant";
    }, 1000);

    setTimeout(() => {
      setLoadingParticipants(false);
    }, 1000);
  }

  function loadChairs() {
    setLoadingChairs(true);

    // show toast
    showLinkRedirectingToast();

    // navigate to the chair login page
    setTimeout(() => {
      window.location.href = "/login/chair";
    }, 1000);

    setTimeout(() => {
      setLoadingChairs(false);
    }, 1000);
  }

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
            <Button
              label="Teilnehmenden-Login"
              icon="pi pi-link"
              loading={loadingParticipants}
              onClick={loadParticipants}
            />
            <Button
              label="Vorsitz-Login"
              icon="pi pi-link"
              loading={loadingChairs}
              onClick={loadChairs}
            />
          </div>
        </div>
      </div>
    </>
  );
}
