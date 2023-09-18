import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Button from "@/components/button";
import {
  faDiagramSubtask,
  faLightEmergencyOn,
  faPlus,
  faScaleBalanced,
  faTrashAlt,
  faUsersLine,
} from "@fortawesome/pro-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toolbar } from "primereact/toolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CommitteeTableProps {
  committees: CommitteeEntry[];
  confirmDeleteAll: (event) => void;
  handleDelete: (committee: CommitteeEntry) => void;
  setInputMaskVisible: (visible: boolean) => void;
}

interface CommitteeEntry {
  name: string;
  shortname: string;
  category: CommitteeCategory;
  isSubcommittee: boolean;
  parent: CommitteeEntry | null;
}

type CommitteeCategory = "committee" | "crisis" | "icj";

export default function CommitteeTable({
  committees,
  confirmDeleteAll,
  handleDelete,
  setInputMaskVisible,
}: CommitteeTableProps) {
  const { LL } = useI18nContext();

  return (
    <>
      <ConfirmPopup />
      <div className="flex flex-col items-stretch justify-center w-full h-full">
        <Toolbar
          end={
            <div className="w-full flex justify-end items-stretch gap-2">
              <Button
                label={LL.admin.onboarding.structure.DELETE_ALL()}
                faIcon={faTrashAlt}
                disabled={committees.length === 0}
                severity="danger"
                onClick={(event) => confirmDeleteAll(event)}
              />
              <Button
                label={LL.admin.onboarding.structure.ADD_COMMITTEE()}
                faIcon={faPlus}
                keyboardShortcut="N"
                onClick={() => setInputMaskVisible(true)}
              />
            </div>
          }
          style={{ borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }}
        />
        <DataTable
          value={committees}
          tableStyle={{ width: "100%" }}
          emptyMessage={LL.admin.onboarding.structure.EMPTY_MESSAGE()}
          footer={LL.admin.onboarding.structure.FOOTER(committees.length)}
          removableSort
        >
          <Column
            field="shortname"
            header={LL.admin.onboarding.structure.COMMITTEE_SHORT()}
            sortable
            className="w-1/6"
          />
          <Column
            field="name"
            header={LL.admin.onboarding.structure.COMMITTEE_LONG()}
            sortable
            className="w-full"
          />
          <Column
            header={LL.admin.onboarding.structure.CATEGORY()}
            body={(rowData) => (
              <span>
                {rowData.category === "committee" &&
                  (rowData.isSubcommittee ? (
                    <div className="m-0 flex items-center justify-start gap-2">
                      <FontAwesomeIcon
                        icon={faDiagramSubtask}
                        className="text-2xl text-primary"
                      />
                      <span className="">{rowData.parent.shortname}</span>
                    </div>
                  ) : (
                    <FontAwesomeIcon
                      icon={faUsersLine}
                      className="text-2xl text-primary"
                    />
                  ))}
                {rowData.category === "crisis" && (
                  <FontAwesomeIcon
                    icon={faLightEmergencyOn}
                    className="text-2xl text-red-500"
                  />
                )}
                {rowData.category === "icj" && (
                  <FontAwesomeIcon
                    icon={faScaleBalanced}
                    className="text-2xl text-green-500"
                  />
                )}
              </span>
            )}
            className="w-1/6"
          />
          <Column
            className="w-1/6"
            body={(rowData) => (
              <Button
                faIcon={faTrashAlt}
                severity="danger"
                onClick={() => handleDelete(rowData)}
              />
            )}
          />
        </DataTable>
      </div>
    </>
  );
}
