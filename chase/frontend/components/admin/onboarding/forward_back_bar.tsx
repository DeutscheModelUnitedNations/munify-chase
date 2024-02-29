import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { faArrowLeft, faCheck } from "@fortawesome/pro-solid-svg-icons";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import useMousetrap from "mousetrap-react";

interface ForwardBackButtonsProps {
  backURL: string;
  handleSaveFunction: () => void;
  saveLoading?: boolean;
  forwardDisabled?: boolean;
}

export default function ForwardBackButtons({
  backURL,
  handleSaveFunction,
  saveLoading,
  forwardDisabled = false,
}: ForwardBackButtonsProps) {
  const { LL } = useI18nContext();
  const router = useRouter();

  useMousetrap("alt+enter", () => {
    if (handleSaveFunction) {
      handleSaveFunction();
    }
  });

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
          keyboardShortcut="⌥ + Enter"
          disabled={forwardDisabled}
        />
      </div>
    </>
  );
}
