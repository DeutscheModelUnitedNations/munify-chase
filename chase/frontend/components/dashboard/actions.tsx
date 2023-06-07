import React from "react";
import WidgetTemplate from "./widgettemplate";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

import {
  faComment,
  faExclamationTriangle,
  faGavel,
  faPaperPlane,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ActionsWidget() {
  const [displayChairDialog, setDisplayChairDialog] = React.useState(false);
  const [displayResearchDialog, setDisplayResearchDialog] =
    React.useState(false);

  const [category, setCategory] = React.useState("");
  const categoryOption = [
    { lable: "Gastrede anfragen", value: "gastrede", icon: faComment },
    { lable: "Faktencheck", value: "faktencheck", icon: faExclamationTriangle },
    {
      lable: "Informationsanfrage",
      value: "information",
      icon: faQuestionCircle,
    },
    { lable: "Generalsekretär anfragen", value: "gs", icon: faGavel },
    { lable: "Sonstiges", value: "sonstiges", icon: faPaperPlane },
  ];
  const [subjectLine, setSubjectLine] = React.useState("");
  const [message, setMessage] = React.useState("");

  const categoryOptionTemplate = (option) => {
    return (
      <div className="flex items-center gap-4">
        <FontAwesomeIcon icon={option.icon} />
        <span>{option.lable}</span>
      </div>
    );
  };

  const categoryOptionSelectedTemplate = (option, props) => {
    if (option) {
      return categoryOptionTemplate(option);
    }
    return props.placeholder;
  };

  const footerContent = ({ sendFunction }) => {
    return (
      <div>
        <Button
          label="Abbrechen"
          icon="pi pi-times"
          onClick={() => closeAndResetDialog()}
          className="p-button-text"
        />
        <Button
          label="Senden"
          icon="pi pi-check"
          onClick={() => sendFunction()}
          autoFocus
          disabled={subjectLine === "" || message === ""}
        />
      </div>
    );
  };

  const closeAndResetDialog = () => {
    setDisplayChairDialog(false);
    setDisplayResearchDialog(false);
    setCategory("");
    setSubjectLine("");
    setMessage("");
  };

  const sendChairMessage = () => {
    // TODO
    closeAndResetDialog();
  };

  const sendResearchMessage = () => {
    // TODO
    closeAndResetDialog();
  };

  return (
    <>
      <Dialog
        header="Nachricht an den Vorsitz senden"
        visible={displayChairDialog}
        style={{ width: "50vw" }}
        footer={footerContent({ sendFunction: sendChairMessage })}
        onHide={() => setDisplayChairDialog(false)}
      >
        <div className="flex flex-col gap-2 mt-1">
          <InputText
            placeholder="Betreff"
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
          />
          <InputTextarea
            rows={5}
            autoResize
            placeholder="Nachricht"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {/* TODO File Upload */}
        </div>
      </Dialog>
      <Dialog
        header="Anfrage an den Wissenschaftlichen Dienst (WD) stellen"
        visible={displayResearchDialog}
        style={{ width: "50vw" }}
        footer={footerContent({ sendFunction: sendResearchMessage })}
        onHide={() => setDisplayResearchDialog(false)}
      >
        <div className="flex flex-col gap-2 mt-1">
          <Dropdown
            value={category}
            onChange={(e) => setCategory(e.value)}
            options={categoryOption}
            optionLabel="Kategorie"
            placeholder="Wähle eine Kategorie"
            itemTemplate={categoryOptionTemplate}
            valueTemplate={categoryOptionSelectedTemplate}
            className="w-full md:w-14rem"
          />
          <InputText
            placeholder="Betreff"
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
          />
          <InputTextarea
            rows={5}
            autoResize
            placeholder="Nachricht"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p>
            Diese Anfrage wird zunächst vom Vorsitz geprüft und erst
            anschließend an den Wissenschaftlichen Dienst weitergeleitet.
          </p>
        </div>
      </Dialog>
      <WidgetTemplate cardTitle="Anfrage senden">
        <div className="flex-1 flex gap-2">
          <Button
            label="Vorsitz"
            className="flex-1"
            icon={<FontAwesomeIcon icon={faGavel} />}
            severity="warning"
            onClick={() => setDisplayChairDialog(true)}
          />
          <Button
            label="Wiss. Dienst"
            className="flex-1"
            icon={<FontAwesomeIcon icon={faPaperPlane} />}
            severity="help"
            onClick={() => setDisplayResearchDialog(true)}
          />
        </div>
      </WidgetTemplate>
    </>
  );
}
