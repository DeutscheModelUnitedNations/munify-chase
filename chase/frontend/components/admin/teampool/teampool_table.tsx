import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Button from "@/components/button";
import { faPlus, faTrashAlt, faUpload } from "@fortawesome/pro-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toolbar } from "primereact/toolbar";
import useMousetrap from "mousetrap-react";

interface TeamPoolTableProps {
  team: Teammember[];
  confirmDeleteAll: (event) => void;
  handleDelete: (teammember: Teammember) => void;
  setInputMaskVisible: (visible: boolean) => void;
  setUploadDialogVisible: (visible: boolean) => void;
}

interface Teammember {
  name: string;
  role: string;
  email: string;
  id: number;
}

export default function TeamPoolTable({
  team,
  confirmDeleteAll,
  handleDelete,
  setInputMaskVisible,
  setUploadDialogVisible,
}: TeamPoolTableProps) {
  const { LL } = useI18nContext();

  useMousetrap("n", () => {
    setInputMaskVisible(true);
  });

  return (
    <>
      <ConfirmPopup />
      <div className="flex flex-col items-stretch justify-center w-full h-full">
        <Toolbar
          end={
            <div className="w-full flex justify-end items-stretch gap-2">
              <Button
                label={LL.admin.onboarding.teampool.DELETE_ALL()}
                faIcon={faTrashAlt}
                disabled={team.length === 0}
                severity="danger"
                onClick={(event) => confirmDeleteAll(event)}
              />
              <Button
                label={LL.admin.onboarding.teampool.UPLOAD_TEAM()}
                faIcon={faUpload}
                severity="secondary"
                onClick={() => setUploadDialogVisible(true)}
              />
              <Button
                label={LL.admin.onboarding.teampool.ADD_TEAMMEMBER()}
                faIcon={faPlus}
                keyboardShortcut="N"
                onClick={() => setInputMaskVisible(true)}
              />
            </div>
          }
          style={{ borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }}
        />
        <DataTable
          value={team}
          tableStyle={{ width: "100%" }}
          emptyMessage={LL.admin.onboarding.teampool.EMPTY_MESSAGE()}
          footer={LL.admin.onboarding.teampool.FOOTER(team.length)}
          removableSort
        >
          <Column
            field="firstName"
            header={LL.admin.onboarding.teampool.FIRST_NAME()}
            sortable
          />
          <Column
            field="lastName"
            header={LL.admin.onboarding.teampool.LAST_NAME()}
            sortable
          />
          <Column
            field="email"
            header={LL.admin.onboarding.teampool.EMAIL()}
            sortable
            className="w-full"
          />
          <Column
            header={LL.admin.onboarding.teampool.ROLE()}
            body={(rowData) => {
              const roleFunction = LL.admin.onboarding.teampool.roles[rowData.role];
              if (!roleFunction) {
                return <span>{rowData.role}</span>;
              } else {
                return <span>{roleFunction()}</span>;
              }
            }}
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
