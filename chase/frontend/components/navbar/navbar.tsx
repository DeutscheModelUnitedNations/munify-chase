"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/navbar/button";
import { useRouter } from "next/navigation";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";

import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ active }) {
    const router = useRouter();

    const acceptLogout = () => {
        // TODO: logout
        router.push("/login/participant");
    };

    const rejectLogout = () => {
        console.log("Logout rejected");
    };

    const confirmLogout = () => {
      confirmDialog({
        message: "Sind sie sicher, dass Sie sich abmelden möchten?",
        icon: "pi pi-exclamation-triangle",
        position: "bottomleft",
        acceptLabel: "Ja",
        acceptIcon: "pi pi-check",
        acceptClassName: "p-button-danger",
        rejectLabel: "Nein",
        rejectIcon: "pi pi-times",
        accept: acceptLogout,
        reject: rejectLogout,
      });
    };

    return (
      <>
        <div className="w-20 h-full bg-dmun flex flex-col items-center gap-10">
          <Image
            src="/logo/png/chase_logo_white_transparent.png"
            alt="Logo"
            width={60}
            height={60}
            className="mt-3"
          />
          <div className="flex flex-col justify-center items-center gap-3">
            <Button
              active={active.index === 0}
              icon={faHouse}
              link={"/participant/dashboard"}
            />
            <Button
              active={active.index === 1}
              icon={faComment}
              link={"/participant/speakers"}
            />
            <Button
              active={active.index === 2}
              icon={faScroll}
              link={"/participant/resolutions"}
            />
            <Button
              active={active.index === 3}
              icon={faSquarePollVertical}
              link={"/participant/voting"}
            />
          </div>
          <div className="flex-1" />
          <div className="flex flex-col items-center gap-3 mb-5">
            <Button
              active={false}
              icon={faGear}
              onClick={() => {
                // TODO: open settings sidebar
                console.log("TODO: open settings sidebar");
              }}
            />
            <ConfirmDialog />
            <Button
              active={false}
              icon={faRightFromBracket}
              onClick={confirmLogout}
            />
          </div>
        </div>
      </>
    );
}


