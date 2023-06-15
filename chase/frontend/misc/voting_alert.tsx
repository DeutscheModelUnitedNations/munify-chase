import { confirmDialog } from "primereact/confirmdialog";

export const votingAlert = (routing: () => void) => {
  // TODO find a way to make this work with the i18n context
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
