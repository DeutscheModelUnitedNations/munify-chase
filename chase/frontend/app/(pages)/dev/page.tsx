"use client";
import Button from "@/components/button";
import { backend } from "@/services/backend";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Conference = Awaited<ReturnType<typeof backend.conference.get>>["data"];

export default function DevQuickstartPage() {
  const router = useRouter();

  const [conferences, setConferences] = useState<Conference | null>(null);

  useEffect(() => {
    backend.conference
      .get()
      .then((res) => {
        setConferences(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="w-screen flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Chase!</h1>
        <p className="text-lg">
          This is a quick start page to help you get started deveolping.
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-8 justify-center items-center">
        <h2 className="text-2xl font-bold">Conferences</h2>
        <div className="flex flex-col gap-2 bg-primary-950">
          {conferences?.map((conference) => (
            <div
              key={conference.id}
              className="flex flex-col gap-1 items-center bg-primary-900 p-4 rounded-xl"
            >
              <p className="text-lg font-bold">{conference.name}</p>
              <div className="flex gap-2">
                <Button
                  label="Chair Hub"
                  onClick={() => {
                    router.push(`/app/${conference.id}/hub/chair`);
                  }}
                />
                <Button
                  label="NA Hub"
                  onClick={() => {
                    router.push(`/app/${conference.id}/hub/na`);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
