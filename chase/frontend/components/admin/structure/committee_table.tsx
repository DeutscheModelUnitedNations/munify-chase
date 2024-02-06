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
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toolbar } from "primereact/toolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Committee } from "@/custom_types/fetching";

export default function CommitteeTable({
  committees,
  confirmDeleteAll,
  handleDelete,
  setInputMaskVisible,
}: {
  committees: Committee[] | null | undefined;
  confirmDeleteAll: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleDelete: (rowData: Committee) => void;
  setInputMaskVisible: (visible: boolean) => void;
}) {
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
                disabled={committees?.length === 0}
                severity="danger"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  confirmDeleteAll(event)
                }
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
          value={committees || []}
          tableStyle={{ width: "100%" }}
          emptyMessage={LL.admin.onboarding.structure.EMPTY_MESSAGE()}
          footer={LL.admin.onboarding.structure.FOOTER(committees?.length || 0)}
          removableSort
        >
          <Column
            field="abbreviation"
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
            body={(rowData) => {
              const matchingCommittee = committees?.find(
                (committee) => committee.id === rowData.parentId,
              );

              return (
                <span>
                  {rowData.category === "COMMITTEE" &&
                    (rowData.parentId ? (
                      <div className="m-0 flex items-center justify-start gap-2">
                        <FontAwesomeIcon
                          icon={faDiagramSubtask}
                          className="text-2xl text-primary"
                        />
                        <span className="">
                          {matchingCommittee
                            ? matchingCommittee.abbreviation
                            : "N/A"}
                        </span>
                      </div>
                    ) : (
                      <FontAwesomeIcon
                        icon={faUsersLine}
                        className="text-2xl text-primary"
                      />
                    ))}
                  {rowData.category === "CRISIS" && (
                    <FontAwesomeIcon
                      icon={faLightEmergencyOn}
                      className="text-2xl text-red-500"
                    />
                  )}
                  {rowData.category === "ICJ" && (
                    <FontAwesomeIcon
                      icon={faScaleBalanced}
                      className="text-2xl text-green-500"
                    />
                  )}
                </span>
              );
            }}
            className="w-1/6"
          />
          <Column
            className="w-1/6"
            body={(rawData) => (
              <Button
                faIcon={faTrashAlt}
                severity="danger"
                onClick={() => handleDelete(rawData)}
              />
            )}
          />
        </DataTable>
      </div>
    </>
  );
}
