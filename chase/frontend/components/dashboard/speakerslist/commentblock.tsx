import React from "react";

export default function CommentBlock({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col bg-white rounded-lg p-3">
        <div className="font-bold mb-2 text-lg">Fragen u. Kurzbemerkungen</div>
          <div className="flex-1 flex flex-col gap-3">
            {children}
          </div>
        </div>
    </>
  );
}