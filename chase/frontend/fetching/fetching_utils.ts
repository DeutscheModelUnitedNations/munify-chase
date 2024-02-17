import { TranslationFunctions } from "@/i18n/i18n-types";
import { backend } from "@/services/backend";
import { Toast } from "primereact/toast";

// Helper functions
export function toastError(
  toast?: React.MutableRefObject<Toast | null>,
  LL?: TranslationFunctions,
  error?: any
) {
  if (toast && LL) {
    toast.current?.show({
      severity: "error",
      summary: LL.admin.onboarding.error.title(),
      detail: LL.admin.onboarding.error.generic(),
    });
  } else {
    console.error("Error in getMyDelegationData:", error ?? "No error provided");
  }
}
