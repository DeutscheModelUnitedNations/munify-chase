import Button from "@/components/button";
import CountryAutoComplete from "@/components/speakers_list/country_auto_complete";
import { useBackend } from "@/contexts/backend";
import { Alpha3Code } from "@/custom_types/custom_types";
import { useI18nContext } from "@/i18n/i18n-react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { faPlus, faXmark } from "@fortawesome/pro-solid-svg-icons";
import useMousetrap from "mousetrap-react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { FormEvent, use, useEffect, useRef, useState } from "react";

type AddDelegationDialogProps = {
  inputMaskVisible: boolean;
  setInputMaskVisible: (visible: boolean) => void;
  addDelegationToList: (alpha3Code: Alpha3Code) => void;
};

export default function AddDelegationDialog({
  inputMaskVisible,
  setInputMaskVisible,
  addDelegationToList,
}: AddDelegationDialogProps) {
  const { LL } = useI18nContext();
  const backend = useBackend();
  const toast = useRef<Toast>(null);

  const [delegationAlpha3Code, setdelegationAlpha3Code] = useState(null);
  const [allAvailableCountries, setAllAvailableCountries] = useState([]);

  const resetInputMask = () => {
    setdelegationAlpha3Code(null);
  };

  async function getAllBaseCountries() {
    const res = await backend.baseData.countries.get().catch((error) => {
      toast.current?.show({
        severity: "error",
        summary: LL.admin.onboarding.error.title(),
        detail: LL.admin.onboarding.error.generic(),
      });
    });
    return res.data.map((country) => country.alpha3Code);
  }

  useEffect(() => {
    getAllBaseCountries().then((allCountries) => {
      setAllAvailableCountries(allCountries);
    });
  }, []);

  const addDelegation = (e: FormEvent | null = null) => {
    if (e) e.preventDefault();
    if (delegationAlpha3Code === null) return;
    console.info(delegationAlpha3Code);
    addDelegationToList(delegationAlpha3Code?.alpha3);
    resetInputMask();
    setInputMaskVisible(false);
  };

  const addDelegationAndStay = (e: FormEvent | null = null) => {
    if (e) e.preventDefault();
    if (delegationAlpha3Code === null) return;
    addDelegationToList(delegationAlpha3Code?.alpha3);
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
            listOfAllCountries={allAvailableCountries}
            selectedCountry={delegationAlpha3Code}
            setSelectedCountry={setdelegationAlpha3Code}
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
        <Toast ref={toast} />
      </Dialog>
    </>
  );
}
