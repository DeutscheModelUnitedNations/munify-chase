"use client";
import React, { useEffect, useState } from "react";
import { backend } from "@/services/backend";
import { faCircleNotch } from "@fortawesome/pro-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "@/contexts/toast";

type redirectDataType = Awaited<
  ReturnType<typeof backend.auth.myRedirectInfo.get>
>["data"];

export default function LoginRedirectPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [redirectData, setRedirectData] = useState<redirectDataType | null>(
    null,
  );

  async function fetchRedirectData() {
    await backend.auth.myRedirectInfo
      .get()
      .then((res) => {
        if (res.status === 200) {
          setRedirectData(res.data);
        }
        throw new Error("Failed to fetch redirect data");
      })
      .catch((err) => {
        showToast({
          severity: "error",
          summary: "Error",
          detail: err.message,
        });
      });
  }

  useEffect(() => {
    fetchRedirectData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {redirectData ? undefined : (
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size="3x"
          className="text-primary-500"
        />
      )}
    </div>
  );
}
