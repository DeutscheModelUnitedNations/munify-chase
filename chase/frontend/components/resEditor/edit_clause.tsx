import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { Dialog } from "primereact/dialog";
import { ClauseType } from "./clause";
import { TabMenu } from "primereact/tabmenu";
import {
  faEye,
  faText,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import SlateClauseEditor from "./slate_clause_editor";
import { Descendant } from "slate";

export default function EditClauseModal({
  clause,
  modalVisible,
  closeFunction,
}: { clause?: ClauseType; modalVisible: boolean; closeFunction: () => void }) {
  const { LL, locale } = useI18nContext();
  const { backend } = useBackend();

  const [activeTab, setActiveTab] = useState(0);

  const [clauseContent, setClauseContent] = useState<Descendant[] | undefined>(
    undefined,
  );

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

  return (
    <>
      <Dialog
        header={clause ? "Edit Clause" : "Add Clause"}
        visible={modalVisible}
        onHide={closeFunction}
        className="w-11/12 md:w-[700px]"
      >
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
            <SlateClauseEditor content={clauseContent} viewOnly />
          </div>
        )}
      </Dialog>
    </>
  );
}
