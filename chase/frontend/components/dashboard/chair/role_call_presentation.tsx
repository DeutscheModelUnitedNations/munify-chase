import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { Dialog } from "primereact/dialog";
import { BigDisplayFlag, LargeFlag } from "@/components/flag_templates";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { AnimatePresence, motion } from "framer-motion";
import FlipMove from "react-flip-move";

export default function RoleCallPresentation() {
  const { LL, locale } = useI18nContext();
  const { backend } = useBackend();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((currentIndex) => {
        return currentIndex + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const countries = [
    "deu",
    "cpv",
    "civ",
    "cze",
    "dnk",
    "dji",
    "dma",
    "dom",
    "ecu",
  ];

  const countriesToDisplay = () => {
    return countries.filter((_countryCode, index) => {
      return index >= currentIndex - 1 && index <= currentIndex + 2;
    });
  };

  return (
    <>
      <Dialog
        visible={true}
        onHide={() => {}}
        header="Anwesenheitskontrolle"
        closable={false}
        modal
        style={{ width: "80vw", height: "80vh" }}
      >
        <FlipMove
          duration={500}
          enterAnimation="fade"
          leaveAnimation="fade"
          appearAnimation="fade"
          className="h-full w-full flex flex-col gap-4 justify-start items-start"
        >
          {countriesToDisplay().map((countryCode, index) => (
            <div
              className="flex justify-start w-full items-center gap-10 bg-primary-950 p-4 rounded-md"
              key={countryCode}
            >
              <LargeFlag
                countryCode={countryCode}
                enlarge={index === currentIndex}
              />
              <h1 className="text-3xl">
                {getCountryNameByCode(countryCode, locale)}
              </h1>
            </div>
          ))}
        </FlipMove>
      </Dialog>
    </>
  );
}
