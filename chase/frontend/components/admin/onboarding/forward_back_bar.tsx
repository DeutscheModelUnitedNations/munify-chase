import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { faArrowLeft, faCheck } from "@fortawesome/pro-solid-svg-icons";
import Button from "@/components/button";
import { useRouter } from "next/navigation";

interface ForwardBackButtonsProps {
  backURL: string;
  handleSaveFunction: () => void;
  saveLoading?: boolean;
}

export default function ForwardBackButtons({
  backURL,
  handleSaveFunction,
  saveLoading,
}: ForwardBackButtonsProps) {
  const { LL } = useI18nContext();
  const router = useRouter();

  return (
    <>
      <div className="w-full mt-8 flex justify-between items-stretch gap-4">
        <Button
          label={LL.admin.onboarding.BUTTON_BACK()}
          className=""
          faIcon={faArrowLeft}
          severity="danger"
          onClick={() => router.push(backURL)}
        />
        <Button
          label={LL.admin.onboarding.BUTTON_ADVANCE()}
          className=""
          faIcon={faCheck}
          onClick={handleSaveFunction}
          loading={saveLoading}
        />
      </div>
    </>
  );
}
