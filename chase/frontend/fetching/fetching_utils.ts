import { ToastContext } from "@/contexts/toast";
import { useI18nContext } from "@/i18n/i18n-react";
import { useContext } from "react";

// Helper functions
export function toastError(error?: Error) {
  const { showToast } = useContext(ToastContext);
  const { LL } = useI18nContext();

  if (LL) {
    showToast({
      severity: "error",
      summary: LL.admin.onboarding.error.title(),
      detail: LL.admin.onboarding.error.generic(),
    });
  } else {
    console.error("Generic Error: ", error ?? "No error provided");
  }
}
