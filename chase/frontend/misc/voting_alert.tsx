import { confirmDialog } from "primereact/confirmdialog";

export const votingAlert = (routing: () => void) => {
  confirmDialog({
    header: "Abstimmung gestartet!",
    message:
      "Sie wurden zu einer neuen Abstimmung aufgerufen. Bitte nehmen Sie schnellstmöglich daran teil.",
    acceptLabel: "Zur Abstimmung",
    acceptIcon: "pi pi-arrow-right",
    accept: routing,
    rejectLabel: "Ignorieren",
  });
};
