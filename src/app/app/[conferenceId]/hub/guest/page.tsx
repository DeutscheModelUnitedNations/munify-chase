"use client";
import { useI18nContext } from "@/frontend/i18n/i18n-react";
import CommitteeGrid from "@/frontend/components/navigation-hub/committee_grid";
import Button from "@/frontend/components/button";
import { useBackend } from "@/contexts/backend";
import { useRouter } from "next/navigation";
import { useToast } from "@/frontend/contexts/toast";

export default function GuestHubPage({
  params,
}: {
  params: { conferenceId: string };
}) {
  const { LL } = useI18nContext();
  const router = useRouter();
  const { toastError } = useToast();
  const { backend } = useBackend();

  return (
    <>
      <div className="flex justify-center items-start min-h-screen bg-primary">
        <div className="flex-1 flex flex-col justify-center items-center m-10 mt-20">
          <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-primary-200 w-11/12 p-5 rounded-md shadow-lg">
            <h1 className="text-3xl">{LL.hub.GUEST_HUB_TITLE()}</h1>
            <h2 className="text-xl mt-2 mb-8">{LL.hub.SELECT_COMMITTEE()}</h2>
            <CommitteeGrid conferenceId={params.conferenceId} />
            <Button
              className="mt-8"
              faIcon="arrow-right-from-bracket"
              label={LL.hub.LOGOUT()}
              onClick={() => {
                backend.auth.logout
                  .get()
                  .then((res) => {
                    if (res.status !== 200)
                      throw new Error("Failed to log out");
                    router.push("/login");
                  })
                  .catch((err) => {
                    toastError(err);
                  });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
