import Button from "@/components/button";
import { NormalFlag } from "@/components/flag_templates";
import { Committee, Delegation } from "@/custom_types/fetching";
import { useI18nContext } from "@/i18n/i18n-react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import {
  faCheck,
  faPlus,
  faTrashAlt,
  faXmark
} from "@fortawesome/pro-solid-svg-icons";
import { Column } from "primereact/column";
import {
  DataTable
} from "primereact/datatable";
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
  openAddDelegationDialog: (state: boolean) => void;
};

export default function DelegationsTable({
  conferenceId,
  delegations,
  committees,
  activateOrDeactivateCommittee,
  deleteDelegation,
  openAddDelegationDialog,
}: DelegationsTableProps) {
  const { LL, locale } = useI18nContext();

  const delegationIsActive = (delegation: Delegation, committee: Committee) => {
    return committee.Delegates.some(
      (delegate) => delegate.delegationId === delegation.id
    );
  };

  const CountCard = ({
    count,
    committee,
  }: {
    count: number;
    committee: string;
  }) => (
    <div className="flex py-3 px-6 bg-white flex-col items-center justify-center rounded-md">
      <div className="text-sm font-normal">{committee}</div>
      <div className="text-2xl">{count}</div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-stretch justify-center w-full h-full">
        <Toolbar
          end={
            <div className="w-full flex justify-end items-stretch gap-2">
              <Button
                label={LL.admin.onboarding.delegations.ADD_DELEGATION_BUTTON()}
                faIcon={faPlus}
                keyboardShortcut="N"
                onClick={() => openAddDelegationDialog(true)}
              />
            </div>
          }
          style={{ borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }}
        />
        <DataTable
          value={delegations}
          className="mb-4"
          emptyMessage={LL.admin.onboarding.delegations.EMPTY_MESSAGE()}
          footer={
            <div className="flex justify-start gap-3">
              <CountCard
                count={delegations.length}
                committee="Total"
              />
              {committees?.map((committee) => (
                <CountCard
                key={committee.id}
                count={
                  delegations.filter((delegation) =>
                    delegationIsActive(delegation, committee)
                  ).length
                }
                committee={committee.abbreviation}
              />
              ))}
            </div>
          }
          removableSort
        >
          <Column
            body={(delegation) => (
              <div className="flex justify-center">
                <NormalFlag countryCode={delegation.alpha3Code} />
              </div>
            )}
          />
          <Column
            body={(delegation) => (
              <span>{getCountryNameByCode(delegation.alpha3Code, locale)}</span>
            )}
            header="Delegation"
            sortable
          />
          {Array.isArray(committees) &&
            committees?.map((committee) => (
              <Column
                key={(delegation) => `${committee.id}-${delegation.alpha3Code}`}
                header={committee.abbreviation}
                alignHeader={"center"}
                align={"center"}
                body={(delegation) => (
                  <Button
                    faIcon={
                      delegationIsActive(delegation, committee)
                        ? faCheck
                        : faXmark
                    }
                    size="small"
                    text={!delegationIsActive(delegation, committee)}
                    severity={
                      delegationIsActive(delegation, committee)
                        ? "primary"
                        : "danger"
                    }
                    onClick={() =>
                      activateOrDeactivateCommittee(
                        conferenceId,
                        delegation.id,
                        committee.id
                      )
                    }
                  />
                )}
              />
            ))}
          <Column
            body={(delegation) => (
              <>
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
