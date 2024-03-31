import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { Dialog } from "primereact/dialog";
import { ClauseType, ClauseTypeEnum, ResDelimiter } from "./clause";
import { TabMenu } from "primereact/tabmenu";
import {
  faCheck,
  faEye,
  faSave,
  faSealExclamation,
  faSealQuestion,
  faText,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import SlateClauseEditor from "./slate_clause_editor";
import { Descendant } from "slate";
import {
  OperatorValidity,
  checkForOperatorsAndValidate,
} from "@/misc/res_parser";
import SmallInfoCard from "../small_info_card";
import { ResDataManipulationType } from "@/app/app/[conferenceId]/res/[resolutionTag]/page";
import Button from "../button";
import useMousetrap from "mousetrap-react";

export default function EditClauseModal({
  clause,
  closeFunction,
  resDataManipulation,
}: {
  clause?: ClauseType;
  closeFunction: () => void;
  resDataManipulation: ResDataManipulationType;
}) {
  const { LL, locale } = useI18nContext();
  const { backend } = useBackend();

  const [activeTab, setActiveTab] = useState(0);

  const [clauseContent, setClauseContent] = useState<Descendant[] | undefined>(
    undefined,
  );

  const [validOperator, setValidOperator] = useState<OperatorValidity>(
    OperatorValidity.NONE,
  );

  useEffect(() => {
    if (clause && !clauseContent) {
      setClauseContent(clause.content);
    }
  }, [clause]);

  useEffect(() => {
    if (!clauseContent || !clause) return;
    setValidOperator(checkForOperatorsAndValidate(clauseContent, clause.type));
  }, [clauseContent]);

  const closeModal = () => {
    setClauseContent(undefined);
    setActiveTab(0);
    closeFunction();
  };

  const MenuIcon = ({ icon }: { icon: IconProp }) => {
    return (
      <div className="w-8 h-full pr-4 flex justify-center items-center">
        <FontAwesomeIcon icon={icon} />
      </div>
    );
  };

  const items = [
    {
      label: "Edit",
      icon: <MenuIcon icon={faText} />,
    },
    {
      label: "Preview",
      icon: <MenuIcon icon={faEye} />,
    },
  ];

  const saveClause = () => {
    if (clauseContent && clause) {
      resDataManipulation.updateClause(clause.id, clauseContent);
      closeModal();
    }
  };

  const deleteClause = () => {
    if (clause) {
      resDataManipulation.deleteClause(clause.id);
      closeModal();
    }
  };

  useMousetrap("ctrl+s", () => saveClause());

  return (
    <>
      <Dialog
        header={"Add Clause"}
        visible={clause !== undefined}
        onHide={() => {
          closeModal();
        }}
        className="w-11/12 md:w-[700px] min-h-[70vh] max-h-[90vh]"
        position="top"
      >
        {clause ? (
          <>
            <TabMenu
              model={items}
              activeIndex={activeTab}
              onTabChange={(e) => setActiveTab(e.index)}
            />
            {activeTab === 0 && (
              <div className="mt-2 w-full">
                <SlateClauseEditor
                  content={clauseContent}
                  setContentFunction={setClauseContent}
                />
              </div>
            )}
            {activeTab === 1 && (
              <div className="mt-2 w-full">
                <SlateClauseEditor
                  content={clauseContent}
                  clauseNumber={
                    clause?.type === "operative" ? clause.number : undefined
                  }
                  delimiter={
                    clause?.type === "operative"
                      ? ResDelimiter.SEMICOLON
                      : ResDelimiter.COMMA
                  }
                  viewOnly
                />
              </div>
            )}
            {validOperator === OperatorValidity.VALID && (
              <SmallInfoCard
                icon={faCheck}
                className="mt-2"
                classNameForContentBox="bg-green-500 text-green-600 border-green-600"
                classNameForIconBox="bg-green-500 text-green-600 border-green-600"
              >
                <div className="flex flex-col">
                  <h3 className="font-bold">
                    {LL.resolutionEditor.editor.VALID_OPERATOR()}
                  </h3>
                  <p>{LL.resolutionEditor.editor.VALID_OPERATOR_DETAILS()}</p>
                </div>
              </SmallInfoCard>
            )}
            {validOperator === OperatorValidity.INVALID && (
              <SmallInfoCard
                icon={faSealExclamation}
                className="mt-2"
                classNameForContentBox="bg-red-500 text-red-500 border-red-500"
                classNameForIconBox="bg-red-500 text-red-500 border-red-500"
              >
                <div className="flex flex-col">
                  <h3 className="font-bold">
                    {LL.resolutionEditor.editor.INVALID_OPERATOR()}
                  </h3>
                  <p>{LL.resolutionEditor.editor.INVALID_OPERATOR_DETAILS()}</p>
                </div>
              </SmallInfoCard>
            )}
            {validOperator === OperatorValidity.NONE && (
              <SmallInfoCard
                icon={faSealQuestion}
                className="mt-2"
                classNameForContentBox="bg-secondary-500 text-secondary-300 border-secondary-300"
                classNameForIconBox="bg-secondary-500 text-secondary-300 border-secondary-300"
              >
                <div className="flex flex-col">
                  <h3 className="font-bold">
                    {LL.resolutionEditor.editor.MISSING_OPERATOR()}
                  </h3>
                  <p>{LL.resolutionEditor.editor.MISSING_OPERATOR_DETAILS()}</p>
                </div>
              </SmallInfoCard>
            )}
            <div className="flex justify-end mt-4 gap-2">
              <Button
                label={LL.resolutionEditor.editor.DELETE_CLAUSE()}
                faIcon={faTrash}
                severity="danger"
                onClick={() => {
                  deleteClause();
                }}
              />
              <Button
                label={LL.resolutionEditor.editor.SAVE_CLAUSE()}
                faIcon={faSave}
                keyboardShortcut="Ctrl + S"
                onClick={() => {
                  saveClause();
                }}
              />
            </div>
          </>
        ) : "No clause selected."}
      </Dialog>
    </>
  );
}
