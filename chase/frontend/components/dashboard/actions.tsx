import React from "react";
import WidgetTemplate from "@components/widget_template";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useI18nContext } from "@/i18n/i18n-react";
import {
  faComment,
  faExclamationTriangle,
  faGavel,
  faInfoCircle,
  faPaperPlane,
  faQuestionCircle,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface DropdownOptions {
  label: string;
  value: string;
  icon: IconProp;
}

/**
 * This Component is used in the Actions Widget on the Dashboard.
 * The buttons of the widget open a dialog with a simple form that allows the user to contact the chair or the research team.
 */

export default function ActionsWidget() {
  const { LL } = useI18nContext();

  const [displayChairDialog, setDisplayChairDialog] = React.useState(false);
  const [displayResearchDialog, setDisplayResearchDialog] =
    React.useState(false);

  const [category, setCategory] = React.useState("");
  const categoryOption: DropdownOptions[] = [
    {
      label:
        LL.participants.dashboard.actionsWidget.contactForm.categoryOptions.GUEST_SPEAKER(),
      value: "guestSspeech",
      icon: faComment as IconProp,
    },
    {
      label:
        LL.participants.dashboard.actionsWidget.contactForm.categoryOptions.FACT_CHECK(),
      value: "factCheck",
      icon: faExclamationTriangle as IconProp,
    },
    {
      label:
        LL.participants.dashboard.actionsWidget.contactForm.categoryOptions.INFORMATION(),
      value: "information",
      icon: faQuestionCircle as IconProp,
    },
    {
      label:
        LL.participants.dashboard.actionsWidget.contactForm.categoryOptions.GENERAL_SECRETARY(),
      value: "generalSecretary",
      icon: faGavel as IconProp,
    },
    {
      label:
        LL.participants.dashboard.actionsWidget.contactForm.categoryOptions.OTHER(),
      value: "other",
      icon: faPaperPlane as IconProp,
    },
  ];
  const [subjectLine, setSubjectLine] = React.useState("");
  const [message, setMessage] = React.useState("");

  const categoryOptionTemplate = (option: DropdownOptions) => {
    return (
      <div className="flex items-center gap-4">
        <FontAwesomeIcon icon={option.icon} />
        <span>{option.label}</span>
      </div>
    );
  };

  // @ts-ignore
  const categoryOptionSelectedTemplate = (option: DropdownOptions, props) => {
    // TODO NO-132 type "props" correctly
    if (option) {
      return categoryOptionTemplate(option);
    }
    return props.placeholder;
  };

  const footerContent = ({ sendFunction }: { sendFunction: VoidFunction }) => {
    return (
      <div>
        <Button
          label={LL.participants.dashboard.actionsWidget.contactForm.CANCEL_BUTTON()}
          icon="pi pi-times"
          onClick={() => closeAndResetDialog()}
          className="p-button-text"
        />
        <Button
          label={LL.participants.dashboard.actionsWidget.contactForm.SEND_BUTTON()}
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
    // TODO NO-133
    closeAndResetDialog();
  };

  const sendResearchMessage = () => {
    // TODO NO-134
    closeAndResetDialog();
  };

  return (
    <>
      <Dialog
        header={LL.participants.dashboard.actionsWidget.contactForm.HEADLINE_CHAIR()}
        visible={displayChairDialog}
        style={{ width: "50vw" }}
        footer={footerContent({ sendFunction: sendChairMessage })}
        onHide={() => setDisplayChairDialog(false)}
      >
        <div className="flex flex-col gap-2 mt-1">
          <InputText
            placeholder={LL.participants.dashboard.actionsWidget.contactForm.SUBJECT_PLACEHOLDER()}
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
          />
          <InputTextarea
            rows={5}
            autoResize
            placeholder={LL.participants.dashboard.actionsWidget.contactForm.MESSAGE_PLACEHOLDER()}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {/* TODO NO-135 File Upload */}
        </div>
      </Dialog>
      <Dialog
        header={LL.participants.dashboard.actionsWidget.contactForm.HEADLINE_RESEARCH_SERVICE()}
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
            optionLabel={LL.participants.dashboard.actionsWidget.contactForm.CATEGORY_LABEL()}
            placeholder={LL.participants.dashboard.actionsWidget.contactForm.CATEGORY_PLACEHOLDER()}
            itemTemplate={categoryOptionTemplate}
            valueTemplate={categoryOptionSelectedTemplate}
            className="w-full md:w-14rem"
          />
          <InputText
            placeholder={LL.participants.dashboard.actionsWidget.contactForm.SUBJECT_PLACEHOLDER()}
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
          />
          <InputTextarea
            rows={5}
            autoResize
            placeholder={LL.participants.dashboard.actionsWidget.contactForm.MESSAGE_PLACEHOLDER()}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p>
            <FontAwesomeIcon icon={faInfoCircle as IconProp} />{" "}
            <small>
              {LL.participants.dashboard.actionsWidget.contactForm.INFO_MESSAGE()}
            </small>
          </p>
        </div>
      </Dialog>
      <WidgetTemplate
        cardTitle={LL.participants.dashboard.widgetHeadlines.ACTIONS()}
      >
        <div className="flex-1 flex gap-2">
          <Button
            label={LL.participants.dashboard.actionsWidget.CHAIR_BUTTON()}
            className="flex-1"
            icon={<FontAwesomeIcon icon={faGavel as IconProp} />}
            severity="warning"
            onClick={() => setDisplayChairDialog(true)}
          />
          <Button
            label={LL.participants.dashboard.actionsWidget.RESEARCH_SERVICE_BUTTON()}
            className="flex-1"
            icon={<FontAwesomeIcon icon={faPaperPlane as IconProp} />}
            severity="help"
            onClick={() => setDisplayResearchDialog(true)}
          />
        </div>
      </WidgetTemplate>
    </>
  );
}
