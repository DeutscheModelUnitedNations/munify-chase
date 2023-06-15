import { TranslationFunctions } from "@/src/i18n/i18n-types";
import { confirmDialog } from "primereact/confirmdialog";

export const votingAlert = (routing: () => void, LL: TranslationFunctions) => {
  confirmDialog({
    header: LL.participants.voting.votingAlert.VOTING_ALERT_HEADER(),
    message: LL.participants.voting.votingAlert.VOTING_ALERT_MESSAGE(),
    acceptLabel: LL.participants.voting.votingAlert.BUTTON_ADVANCE(),
    acceptIcon: "pi pi-arrow-right",
    accept: routing,
    rejectLabel: LL.participants.voting.votingAlert.BUTTON_IGNORE(),
  });
};
