import { TranslationFunctions } from "@/i18n/i18n-types";
import { confirmDialog } from "primereact/confirmdialog";

export const votingAlert = (routing: () => void, LL: TranslationFunctions) => {
  /**
   * This function is used to display a prompt to the user when a new Vote is opened
   * to guide them to the voting page.
   */

  confirmDialog({
    header: LL.participants.voting.votingAlert.VOTING_ALERT_HEADER(),
    message: LL.participants.voting.votingAlert.VOTING_ALERT_MESSAGE(),
    acceptLabel: LL.participants.voting.votingAlert.BUTTON_ADVANCE(),
    acceptIcon: "pi pi-arrow-right",
    accept: routing,
    rejectLabel: LL.participants.voting.votingAlert.BUTTON_IGNORE(),
  });
};
