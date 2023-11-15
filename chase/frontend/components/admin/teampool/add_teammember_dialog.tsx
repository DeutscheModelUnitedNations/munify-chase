import React, { FormEvent, useEffect, useRef, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import {
  faPlus,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import Button from "@/components/button";
import useMousetrap from "mousetrap-react";
import { set } from "react-hook-form";

type AddTeammemberDialogProps = {
  inputMaskVisible: boolean;
  setInputMaskVisible: (visible: boolean) => void;
  addTeammemberToList: (
    firstName: string,
    lastName: string,
    email: string,
    role:
      | "ADMIN"
      | "CHAIR"
      | "SECRETARIAT"
      | "PARTICIPANT_CARE"
      | "TEAM"
      | "GUEST"
  ) => void;
};

export default function AddTeammemberDialog({
  inputMaskVisible,
  setInputMaskVisible,
  addTeammemberToList,
}: AddTeammemberDialogProps) {
  const { LL } = useI18nContext();
  const toast = useRef<Toast>(null);

  const [newTeammemberFirstName, setTeammemberFirstName] = useState("");
  const [newTeammemberLastName, setTeammemberLastName] = useState("");
  const [newTeammemberEmail, setTeammemberEmail] = useState("");
  const [newTeammemberRole, setTeammemberRole] = useState<
    "ADMIN" | "CHAIR" | "COMMITTEE_ADVISOR" | "SECRETARIAT" | "PARTICIPANT_CARE" | "TEAM" | "GUEST"
  >("GUEST");

  const roles = [
    {
      name: LL.admin.onboarding.teampool.roles.ADMIN(),
      value: "ADMIN",
    },
    {
      name: LL.admin.onboarding.teampool.roles.CHAIR(),
      value: "CHAIR",
    },
    {
      name: LL.admin.onboarding.teampool.roles.COMMITTEE_ADVISOR(),
      value: "COMMITTEE_ADVISOR",
    },
    {
      name: LL.admin.onboarding.teampool.roles.SECRETARIAT(),
      value: "SECRETARIAT",
    },
    {
      name: LL.admin.onboarding.teampool.roles.PARTICIPANT_CARE(),
      value: "PARTICIPANT_CARE",
    },
    {
      name: LL.admin.onboarding.teampool.roles.TEAM(),
      value: "TEAM",
    },
    {
      name: LL.admin.onboarding.teampool.roles.GUEST(),
      value: "GUEST",
    },
  ];

  const resetInputMask = () => {
    setTeammemberFirstName("");
    setTeammemberLastName("");
    setTeammemberEmail("");
    setTeammemberRole("GUEST");
  };

  const addCommittee = (e: FormEvent | null = null) => {
    if (e) e.preventDefault();
    addTeammemberToList(
      newTeammemberFirstName,
      newTeammemberLastName,
      newTeammemberEmail,
      newTeammemberRole
    );
    resetInputMask();
    setInputMaskVisible(false);
  };

  useMousetrap("esc", () => {
    setInputMaskVisible(false);
    resetInputMask();
  });

  useMousetrap("enter", () => {
    if (newTeammemberFirstName === "") return;
    if (newTeammemberLastName === "") return;
    if (newTeammemberEmail === "") return;
    addCommittee();
  });

  return (
    <>
      <Dialog
        header={LL.admin.onboarding.teampool.ADD_TEAMMEMBER()}
        visible={inputMaskVisible}
        onHide={() => setInputMaskVisible(false)}
        className="w-3/4"
      >
        <form
          className="flex flex-col items-stretch justify-center gap-4 w-full mt-2"
          onSubmit={(e) => addCommittee(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          <InputText
            id="firstName"
            value={newTeammemberFirstName}
            onChange={(e) => setTeammemberFirstName(e.target.value)}
            className="w-full"
            required
            placeholder={LL.admin.onboarding.teampool.FIRST_NAME()}
            autoFocus
          />
          <InputText
            id="lastName"
            value={newTeammemberLastName}
            onChange={(e) => setTeammemberLastName(e.target.value)}
            className="w-full"
            required
            placeholder={LL.admin.onboarding.teampool.LAST_NAME()}
          />
          <InputText
            id="email"
            value={newTeammemberEmail}
            onChange={(e) => setTeammemberEmail(e.target.value)}
            className="w-full"
            required
            placeholder={LL.admin.onboarding.teampool.EMAIL()}
            // TODO: Add email validation
          />
          {roles.map((role) => {
            return (
              <div key={role.value} className="flex align-items-center">
                <RadioButton
                  inputId={role.value}
                  name="role"
                  value={role.value}
                  onChange={(e) => setTeammemberRole(e.value)}
                  checked={newTeammemberRole === role.value}
                />
                <label htmlFor={role.value} className="ml-2">
                  {role.name}
                </label>
              </div>
            );
          })}
          <div className="mt-4 flex w-full gap-2">
            <Button
              label={LL.admin.onboarding.structure.input.BUTTON_CANCEL()}
              className="w-full"
              severity="warning"
              faIcon={faXmark}
              onClick={() => {
                setInputMaskVisible(false);
                resetInputMask();
              }}
              keyboardShortcut="Esc"
            />
            <Button
              label={LL.admin.onboarding.structure.input.BUTTON_ADD()}
              className="w-full"
              faIcon={faPlus}
              type="submit"
              keyboardShortcut="⏎"
            />
          </div>
        </form>
        <Toast ref={toast} />
      </Dialog>
    </>
  );
}
