import React, { FormEvent, useRef, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";

import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { Dropdown } from "primereact/dropdown";
import {
  faLightEmergencyOn,
  faPlus,
  faScaleBalanced,
  faUsersLine,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import Button from "@/components/button";
import useMousetrap from "mousetrap-react";

type AddCommitteeDialogProps = {
  inputMaskVisible: boolean;
  setInputMaskVisible: (visible: boolean) => void;
  addCommitteeToList: (
    name: string,
    shortname: string,
    category: CommitteeCategory,
    isSubcommittee: boolean,
    parent: CommitteeEntry | null
  ) => void;
  committees: CommitteeEntry[];
};

export default function AddCommitteeDialog({
  inputMaskVisible,
  setInputMaskVisible,
  addCommitteeToList,
  committees,
}: AddCommitteeDialogProps) {
  const { LL } = useI18nContext();
  const toast = useRef<Toast>(null);

  const [newCommitteeName, setNewCommitteeName] = useState("");
  const [newCommitteeShortname, setNewCommitteeShortname] = useState("");
  const [newCommitteeCategory, setNewCommitteeCategory] =
    useState<CommitteeCategory>("committee");
  const [newCommitteeIsSubcommittee, setNewCommitteeIsSubcommittee] =
    useState(false);
  const [newCommitteeParent, setNewCommitteeParent] = useState(null);

  const resetInputMask = () => {
    setNewCommitteeName("");
    setNewCommitteeShortname("");
    setNewCommitteeCategory("committee");
    setNewCommitteeIsSubcommittee(false);
    setNewCommitteeParent(null);
  };

  const addCommittee = (e: FormEvent | null = null) => {
    if (e) e.preventDefault();
    addCommitteeToList(
      newCommitteeName,
      newCommitteeShortname,
      newCommitteeCategory,
      newCommitteeIsSubcommittee,
      newCommitteeParent
    );
    setInputMaskVisible(false);
    resetInputMask();
  };

  const categories = [
    {
      name: LL.admin.onboarding.structure.input.CATEGORY_SWITCH_COMMITTEE(),
      value: "committee",
      icon: faUsersLine,
    },
    {
      name: LL.admin.onboarding.structure.input.CATEGORY_SWITCH_CRISIS(),
      value: "crisis",
      icon: faLightEmergencyOn,
    },
    {
      name: LL.admin.onboarding.structure.input.CATEGORY_SWITCH_ICJ(),
      value: "icj",
      icon: faScaleBalanced,
    },
  ];

  useMousetrap("esc", () => {
    setInputMaskVisible(false);
    resetInputMask();
  });

  useMousetrap("enter", () => {
    if (newCommitteeName || newCommitteeShortname) return;
    if (newCommitteeIsSubcommittee && !newCommitteeParent) return;
    addCommittee();
  });

  return (
    <>
      <Dialog
        header={LL.admin.onboarding.structure.ADD_COMMITTEE()}
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
            id="committeeName"
            value={newCommitteeName}
            onChange={(e) => setNewCommitteeName(e.target.value)}
            className="w-full"
            required
            placeholder={LL.admin.onboarding.structure.COMMITTEE_LONG()}
            autoFocus
          />
          <InputText
            id="committeeShortname"
            value={newCommitteeShortname}
            onChange={(e) => setNewCommitteeShortname(e.target.value)}
            className="w-full"
            required
            placeholder={LL.admin.onboarding.structure.COMMITTEE_SHORT()}
          />
          <SelectButton
            value={newCommitteeCategory}
            onChange={(e) => {
              setNewCommitteeCategory(e.value);
              if (e.value !== "committee") {
                setNewCommitteeParent(null);
                setNewCommitteeIsSubcommittee(false);
              }
            }}
            optionLabel="name"
            options={categories}
            unselectable={false}
          />
          <div className="flex justify-start items-center">
            <InputSwitch
              checked={newCommitteeIsSubcommittee}
              onChange={(e) => setNewCommitteeIsSubcommittee(e.value)}
              disabled={newCommitteeCategory !== "committee"}
            />
            <label className="ml-2">
              {LL.admin.onboarding.structure.input.IS_SUBCOMMITTEE()}
            </label>
          </div>
          <Dropdown
            value={newCommitteeParent}
            options={committees.filter(
              (c) => !c.isSubcommittee && c.category === "committee"
            )}
            onChange={(e) => setNewCommitteeParent(e.value)}
            optionLabel="name"
            placeholder={LL.admin.onboarding.structure.input.PARENT_COMMITTEE()}
            disabled={!newCommitteeIsSubcommittee}
            required={newCommitteeIsSubcommittee}
          />
          <div className="mt-4 flex w-full gap-2">
            <Button
              label={LL.admin.onboarding.structure.input.BUTTON_CANCEL()}
              className="w-full"
              severity="warning"
              faIcon={faXmark}
              onClick={() => {
                setInputMaskVisible(false);
                setNewCommitteeName("");
                setNewCommitteeShortname("");
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
