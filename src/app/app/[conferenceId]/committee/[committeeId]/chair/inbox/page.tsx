"use client";
import { useState } from "react";
import InboxTemplate from "@/app/components/inbox/inbox_template";
import Button from "@/app/components/button";
import { ActionsOverlayResearchService } from "@/app/components/dashboard/actions_overlay";
import { useAuthorizedQuery } from "@/app/hooks/gqty/useAuthorizedQuery";

export default function InboxPage() {
  const { findManyMessages } = useAuthorizedQuery();
  const [selectedMessageId, setSelectedMessageId] =
    useState<ReturnType<typeof findManyMessages>[number]["id"]>();
  const [displayResearchDialog, setDisplayResearchDialog] = useState(false);

  async () => {
    (await findManyMessages())[0].committee.id;
  };

  return (
    <>
      <ActionsOverlayResearchService
        showOverlay={displayResearchDialog}
        setShowOverlay={setDisplayResearchDialog}
        isChair
      />
      <InboxTemplate
        isResearchService={false}
        messages={findManyMessages()}
        selectedMessage={selectedMessageId}
        setSelectedMessage={setSelectedMessageId}
        getMessagesFunction={findManyMessages}
      />
      <div className="absolute bottom-5 right-5">
        <Button
          faIcon="plus"
          className="z-50"
          raised
          onClick={() => setDisplayResearchDialog(true)}
        />
      </div>
    </>
  );
}
