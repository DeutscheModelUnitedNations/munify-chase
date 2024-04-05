"use client";
import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import Button from "@/components/button";
import { AnimatePresence, motion } from "framer-motion";
import { RadioButton } from "primereact/radiobutton";
import {
  faArrowLeft,
  faArrowRight,
  faArrowsUpDown,
  faEdit,
  faGavel,
  faHashtag,
  faPaperPlane,
  faPencil,
  faPencilAlt,
  faPencilMechanical,
  faPlus,
  faPlusLarge,
  faPodium,
  faScroll,
  faTrash,
} from "@fortawesome/pro-solid-svg-icons";
import SmallInfoCard from "@/components/small_info_card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function NewAmendmentPage() {
  const { LL, locale } = useI18nContext();
  const { backend } = useBackend();

  const [state, setState] = useState(0);

  const ptStates: {
    state: number;
    setState: (state: number) => void;
  } = {
    state,
    setState,
  };

  const states = [
    <StartingState {...ptStates} />,
    <SecondState {...ptStates} />,
  ];

  return states[state];
}

function Card({
  state,
  children,
}: {
  state: number;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        className="flex flex-col justify-start p-10 h-full w-full bg-white shadow-xl rounded-xl"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function Buttons({
  functions,
}: {
  functions: {
    backFunction: () => void;
    nextFunction: () => void;
    sendFunction: () => void;
  };
}) {
  return (
    <div className="flex gap-4 self-end">
      {functions?.backFunction && (
        <Button
          outlined
          label="Zurück"
          faIcon={faArrowLeft}
          onClick={functions.backFunction}
        />
      )}
      {functions?.nextFunction && (
        <Button
          label="Weiter"
          faIcon={faArrowRight}
          onClick={functions.nextFunction}
        />
      )}
      {functions?.sendFunction && (
        <Button
          label="Absenden"
          faIcon={faPaperPlane}
          onClick={functions.sendFunction}
        />
      )}
    </div>
  );
}

function StartingState({ state, setState }) {
  return (
    <>
      <Card state={state}>
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="text-3xl font-bold">Neuer Änderungsantrag</h1>
          <p className="text">Dies ist ein Test</p>
        </div>
        <div className="flex flex-col justify-center gap-2 mt-5">
          <SmallInfoCard icon={faGavel}>Generalversammlung</SmallInfoCard>
          <SmallInfoCard icon={faPodium}>Umgang mit Abfall</SmallInfoCard>
          <SmallInfoCard icon={faScroll}>
            <FontAwesomeIcon icon={faHashtag} className="mr-2" />
            123
          </SmallInfoCard>
        </div>
      </Card>
      <Buttons functions={{ nextFunction: () => setState(1) }} />
    </>
  );
}

function SecondState({ state, setState }) {
  const router = useRouter();

  const selections = [
    {
      label: "Absatz einfügen",
      icon: faPlusLarge,
      onclick: () => {
        router.push("./new/add");
      },
    },
    {
      label: "Text eines Absatzes ändern",
      icon: faPencil,
      onclick: () => {
        router.push("./new/edit");
      },
    },
    {
      label: "Absatz verschieben",
      icon: faArrowsUpDown,
      onclick: () => {
        router.push("./new/move");
      },
    },
    {
      label: "Absatz löschen",
      icon: faTrash,
      onclick: () => {
        router.push("./new/delete");
      },
    },
  ];

  return (
    <>
      <Card state={state}>
        <div className="flex flex-col gap-2 justify-center">
          <h1 className="text-3xl font-bold">Helloooo</h1>
          <p className="text">Dies ist ein Test</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5">
          {selections.map((selection) => (
            <Button
              faIcon={selection.icon}
              label={selection.label}
              onClick={selection.onclick}
            />
          ))}
        </div>
      </Card>
      <Buttons functions={{ backFunction: () => setState(0) }} />
    </>
  );
}
