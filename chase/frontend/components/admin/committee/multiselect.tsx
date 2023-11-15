import { useI18nContext } from "@/i18n/i18n-react";
import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";

export const ChairMultiSelect = ({ committee, chairs }) => {
    const [committeeChairs, setCommitteeChairs] = useState([]);
    const { LL } = useI18nContext();
  
    useEffect(() => {
      setCommitteeChairs(
        chairs.filter((chair) => chair.committeeId === committee.id)
      );
    }, [chairs]);
  
    return (
      <span className="p-float-label mt-4">
        <MultiSelect
          value={committeeChairs}
          options={chairs}
          onChange={(e) => {
            setCommitteeChairs(e.value);
          }}
          itemTemplate={(chair) => (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{chair.firstName}</span>
              <span className="text-sm">{chair.lastName}</span>
            </div>
          )}
          optionLabel="firstName"
          display="chip"
          filter
          className="w-full"
        />
        <label htmlFor="ms-cities">
          {LL.admin.onboarding.committees.CHAIRS()}
        </label>
      </span>
    );
  };

export const AdvisorMultiSelect = ({ committee, advisors }) => {
    const { LL } = useI18nContext();
    
    const [committeeAdvisors, setCommitteeChairs] = useState([]);
  
    return (
      <span className="p-float-label mt-8">
        <MultiSelect
          value={committeeAdvisors}
          options={advisors}
          onChange={(e) => {
            setCommitteeChairs(e.value);
            updateAdvisors(committee, e.value[0]);
          }}
          itemTemplate={(chair) => (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold">{chair.firstName}</span>
              <span className="text-sm">{chair.lastName}</span>
            </div>
          )}
          optionLabel="firstName"
          display="chip"
          filter
          className="w-full"
        />
        <label htmlFor="ms-cities">
          {LL.admin.onboarding.committees.ADVISORS()}
        </label>
      </span>
    );
  };