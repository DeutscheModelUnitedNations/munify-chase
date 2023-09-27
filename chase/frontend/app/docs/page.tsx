"use client";
import React from "react";
import Navbar from "@/components/home/navbar";
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons";
import Footer from "@/components/home/footer";
import Button from "@/components/button";
import { useRouter } from "next/navigation";

export default function Docs() {
  const Router = useRouter();

  return (
    <>
      <Navbar />
      <div className="flex flex-col bg-primary-950 pt-60">
        <div className="flex flex-col items-center justify-center">
          <h1
            className="text-5xl font-bold"
            style={{
              fontFamily: "Vollkorn",
            }}
          >
            Docs
          </h1>
          <p className="text-lg mb-10">
            The documentation for Chase. Still Work in Progress.
          </p>
          <Button
            label="Go back"
            faIcon={faArrowLeft}
            onClick={() => {
              Router.push("/");
            }}
          />
          <div className="h-96" />
        </div>
      </div>
      <Footer />
    </>
  );
}
