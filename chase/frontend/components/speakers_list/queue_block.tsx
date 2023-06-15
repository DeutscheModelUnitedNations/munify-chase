import React from "react";
import Image from "next/image";
import { CountryCode, Speaker } from "@/custom_types";
import { SmallFlag as Flag } from "@components/flag_templates";
import { AnimatePresence, motion } from "framer-motion";

export default function SpeakerBlock({
  list,
  myCountry,
}: { list: Speaker[]; myCountry: CountryCode }) {
  const compressedList = () => {
    let compressedList = [];

    if (list.length > 3) {
      compressedList = list.slice(0, 3);
    } else {
      compressedList = list;
    }

    const myCountryItem = list.find((item) => item.countryCode === myCountry);
    if (!myCountryItem) {
      return compressedList;
    }
    const myCountryIndex = list.indexOf(myCountryItem);

    if (myCountryIndex < 2) {
      compressedList = list.slice(0, 3);
    }

    return compressedList;
  };

  const getWaitingPosition = () => {
    if (list.find((item) => item.countryCode === myCountry)) {
      // @ts-ignore TODO fix this
      return (
        list.indexOf(list.find((item) => item.countryCode === myCountry)) + 1
      );
    } else {
      return 0;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={list[0].countryCode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          layout
        >
          <div className="flex gap-1">
            {list.length > 0 && (
              <>
                <Arrow arrowName="top" />
                <Flag
                  countryCode={compressedList()[0].countryCode}
                  showNameOnHover
                />
              </>
            )}
            {list.length > 1 && (
              <>
                <Arrow arrowName="solid" />
                <Flag
                  countryCode={compressedList()[1].countryCode}
                  showNameOnHover
                />
              </>
            )}
            {getWaitingPosition() <= 3 ? (
              list.length > 2 && (
                <>
                  <Arrow arrowName="solid" />
                  <Flag
                    countryCode={compressedList()[2].countryCode}
                    showNameOnHover
                  />
                </>
              )
            ) : (
              <>
                <Arrow arrowName="dashed" />
                <div className="self-center px-2 py-1 bg-dmun text-white rounded-md">
                  <div className="text-sm font-bold">
                    {getWaitingPosition() - 3}
                  </div>
                </div>
                <Arrow arrowName="dashed" />
                <Flag
                  countryCode={compressedList()[2].countryCode}
                  showNameOnHover
                />
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function Arrow({ arrowName }: { arrowName: string }) {
  return (
    <div className="flex flex-col justify-center">
      <Image
        src={`/misc/flag_arrows/${arrowName}.png`}
        width={20}
        height={15}
        alt="arrow"
        style={{ objectFit: "contain", height: "100%" }}
      />
    </div>
  );
}
