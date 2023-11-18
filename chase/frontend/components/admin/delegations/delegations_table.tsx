import Button from "@/components/button";
import { NormalFlag } from "@/components/flag_templates";
import { Committee, Delegation } from "@/custom_types/fetching";
import { useI18nContext } from "@/i18n/i18n-react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import {
  faCheck,
  faPencilAlt,
  faPlus,
  faTrashAlt,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ToggleButton } from "primereact/togglebutton";
import { Toolbar } from "primereact/toolbar";

type DelegationsTableProps = {
  conferenceId: string;
  delegations: Delegation[];
  committees: Committee[];
  activateOrDeactivateCommittee: (
    conferenceId: string,
    delegationId: string,
    committeeId: string
  ) => void;
  deleteDelegation: (conferenceId: string, delegationId: string) => void;
};

export default function DelegationsTable({
  conferenceId,
  delegations,
  committees,
  activateOrDeactivateCommittee,
  deleteDelegation,
}: DelegationsTableProps) {
  const { LL, locale } = useI18nContext();

  return (
    <>
      <div className="flex flex-col items-stretch justify-center w-full h-full">
        <Toolbar
          end={
            <div className="w-full flex justify-end items-stretch gap-2">
              <Button
                label="Add Delegation"
                faIcon={faPlus}
                keyboardShortcut="N"
                onClick={() => {}}
              />
            </div>
          }
          style={{ borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }}
        />
        <DataTable
          value={delegations}
          className="mb-4"
          emptyMessage="No delegations found"
          footer="Sum of delegations: "
          removableSort
        >
          <Column
            body={(delegation) => (
              <span>{getCountryNameByCode(delegation.alpha3Code, locale)}</span>
            )}
            header="Delegation"
            sortable
          />
          <Column
            body={(delegation) => (
              <div className="flex justify-center">
                <NormalFlag countryCode={delegation.alpha3Code} />
              </div>
            )}
          />
          {Array.isArray(committees) &&
            committees?.map((committee) => (
              <Column
                key={(delegation) => `${committee.id}-${delegation.alpha3Code}`}
                header={committee.abbreviation}
                alignHeader={"center"}
                align={"center"}
                body={(delegation) => {
                  if (
                    committee.Delegates.some(
                      (delegate) => delegate.delegationId === delegation.id
                    )
                  ) {
                    return <FontAwesomeIcon icon={faCheck} />;
                  }
                }}
              />
            ))}
          <Column
            body={(delegation) => (
              <>
                <Button
                  severity="primary"
                  text
                  faIcon={faPencilAlt}
                  onClick={() => editDelegation(delegation.id)}
                  className="h-full"
                />
                <Button
                  severity="danger"
                  text
                  faIcon={faTrashAlt}
                  onClick={() => deleteDelegation(conferenceId, delegation.id)}
                  className="h-full"
                />
              </>
            )}
          />
        </DataTable>
      </div>
    </>
  );
}
