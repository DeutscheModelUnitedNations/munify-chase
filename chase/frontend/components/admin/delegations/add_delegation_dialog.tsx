import Button from "@/components/button";
import CountryAutoComplete from "@/components/speakers_list/country_auto_complete";
import { useBackend, type BackendInstanceType } from "@/contexts/backend";
import { useI18nContext } from "@/i18n/i18n-react";
import { faPlus, faXmark } from "@fortawesome/pro-solid-svg-icons";
import useMousetrap from "mousetrap-react";
import { Dialog } from "primereact/dialog";
import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/contexts/toast";

export type AllAvailableCountriesType = Awaited<
  ReturnType<BackendInstanceType["baseData"]["countries"]["get"]>
>["data"];

type CountryDataWithoutNameType =
  NonNullable<AllAvailableCountriesType>[number];

export type CountryDataType = CountryDataWithoutNameType & {
  name?: string;
}

export default function AddDelegationDialog({
  inputMaskVisible,
  setInputMaskVisible,
  addDelegationToList,
}: {
  inputMaskVisible: boolean;
  setInputMaskVisible: (visible: boolean) => void;
  addDelegationToList: (alpha3Code: string) => void;
}) {
  const { LL } = useI18nContext();
  const { toastError } = useToast();
  const { backend } = useBackend();

  const [delegationData, setDelegationData] = useState<CountryDataType | null>(
    null,
  );
  const [allAvailableCountries, setAllAvailableCountries] =
    useState<AllAvailableCountriesType | null>(null);

  const resetInputMask = () => {
    setDelegationData(null);
  };

  async function getAllBaseCountries() {
    await backend.baseData.countries
      .get()
      .then((res) => {
        if (res.status >= 400) throw new Error("Failed to fetch countries");
        setAllAvailableCountries(res.data);
      })
      .catch((error) => {
        toastError(error);
      });
  }

  useEffect(() => {
    getAllBaseCountries();
  }, []);

  const addDelegation = (e: FormEvent | null = null) => {
    if (e) e.preventDefault();
    if (!delegationData) return;
    addDelegationToList(delegationData.alpha3Code);
    resetInputMask();
    setInputMaskVisible(false);
  };

  const addDelegationAndStay = (e: FormEvent | null = null) => {
    if (e) e.preventDefault();
    if (!delegationData) return;
    addDelegationToList(delegationData.alpha3Code);
    resetInputMask();
  };

  useMousetrap("esc", () => {
    resetInputMask();
    setInputMaskVisible(false);
  });

  useMousetrap("enter", () => {
    addDelegation();
  });

  useMousetrap("shift+enter", () => {
    addDelegationAndStay();
  });

  return (
    <>
      <Dialog
        header={LL.admin.onboarding.delegations.add_delegation.HEADLINE()}
        visible={inputMaskVisible}
        onHide={() => setInputMaskVisible(false)}
        className="w-3/4"
      >
        <div className="flex flex-col items-stretch justify-center gap-4 w-full mt-2">
          <CountryAutoComplete
            allCountries={allAvailableCountries}
            selectedCountry={delegationData}
            setSelectedCountry={setDelegationData}
            placeholder={LL.admin.onboarding.delegations.add_delegation.SEARCH_PLACEHOLDER()}
          />
          <div className="mt-4 flex w-full gap-2">
            <Button
              label={LL.admin.onboarding.delegations.add_delegation.BACK_BUTTON()}
              severity="warning"
              faIcon={faXmark}
              onClick={() => {
                setInputMaskVisible(false);
                resetInputMask();
              }}
              keyboardShortcut="Esc"
            />
            <div className="flex-1" />
            <Button
              label={LL.admin.onboarding.delegations.add_delegation.ADD_MORE_BUTTON()}
              faIcon={faPlus}
              type="submit"
              keyboardShortcut="⇧+⏎"
              onClick={() => addDelegationAndStay()}
            />
            <Button
              label={LL.admin.onboarding.delegations.add_delegation.ADD_BUTTON()}
              faIcon={faPlus}
              type="submit"
              keyboardShortcut="⏎"
              onClick={() => addDelegation()}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
