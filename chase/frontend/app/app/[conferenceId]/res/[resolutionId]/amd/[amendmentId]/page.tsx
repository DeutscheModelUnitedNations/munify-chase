"use client";
import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";
import { ScrollPanel } from "primereact/scrollpanel";
import { Text } from "slate";
import { CustomElement, CustomText } from "@/components/resEditor/slate_types";
import romanize from "@/misc/to_roman_numerals";
import Button from "@/components/button";
import {
  faArrowLeft,
  faArrowRight,
  faArrowsLeftRight,
  faArrowsUpDown,
  faBars,
  faCheck,
  faFlag,
  faHashtag,
  faListOl,
  faParagraph,
  faSignature,
  faXmark,
} from "@fortawesome/pro-solid-svg-icons";
import { NormalFlag, SmallFlag } from "@/components/flag_templates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useRouter } from "next/navigation";

export default function COMPONENT_TITLE() {
  const { LL, locale } = useI18nContext();
  const { backend } = useBackend();

  const [originalText, setOriginalText] = useState("");
  const [changedText, setChangedText] = useState("");

  const [splitView, setSplitView] = useState(false);

  const serialisation = (nodes: (CustomElement | CustomText)[]) => {
    const serialize = (
      node: CustomElement | CustomText,
      layer = 0,
      itemCounter?,
    ) => {
      if (Text.isText(node)) {
        let string = node.text;
        if (node.operator) {
          string = `**${string}**`;
        }
        return string;
      }

      const getCounterByLayer = (counter: number) => {
        switch (layer) {
          case 1:
            return romanize(counter);
          case 2:
          case 3:
            return "abcdefghijklmnopqrstuvwxyz"[(counter - 1) % 26];
          case 4:
          case 5:
            return romanize(counter).toLowerCase();
          case 6:
          case 7:
            return counter;
          default:
            return "";
        }
      };

      const children = node.children
        .map((n, index) => serialize(n, layer + 1, index + 1))
        .join("");

      switch (node.type) {
        case "paragraph":
          return `${children}\n`;
        case "list-item":
          return `${getCounterByLayer(itemCounter)}. ${children}`;
        case "list-item-text":
          return `${children}\n`;
        default:
          return children;
      }
    };
    return nodes.map((node) => serialize(node)).join("");
  };

  useEffect(() => {
    const testDataOld = [
      {
        type: "paragraph",
        children: [
          {
            text: "unterstreicht",
            operator: true,
          },
          {
            text: " die Wichtigkeit für Sicherheit und Stabilität, indem",
          },
        ],
      },
      {
        children: [
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "eine Unterstützung bei der Wiederherstellung der öffentlichen und rechtlichen Ordnung durch die Bereitstellung von Ressourcen für die Ausbildung und Ausrüstung der örtlichen Sicherheitskräfte geleistet wird,",
                  },
                ],
              },
              {
                children: [
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "eine Unterstützung bei der Wiederherstellung der öffentlichen und rechtlichen Ordnung durch die Bereitstellung von Ressourcen für die Ausbildung und Ausrüstung der örtlichen Sicherheitskräfte geleistet wird,",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "dringend dazu aufgefordert wird den Dialog zwischen den politischen Akteuren und der Zivilgesellschaft zu fördern, um friedliche Lösungen für politische und gesellschaftliche Konflikte zu finden und die Demokratie zu stärken,",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "unter Bezug auf die UNCAC die Verbreitung von Korruption und illegalem Handel eingedämmt werden muss, um die Sicherheit und Stabilität des Landes langfristig zu gewährleisten",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "eine Geberkonferenz ausgerufen wird, in welchem die Aspekte ausgearbeitet und finalisiert werden",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                ],
                type: "ordered-list",
              },
            ],
            type: "list-item",
          },
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "dringend dazu aufgefordert wird den Dialog zwischen den politischen Akteuren und der Zivilgesellschaft zu fördern, um friedliche Lösungen für politische und gesellschaftliche Konflikte zu finden und die Demokratie zu stärken,",
                  },
                ],
              },
            ],
            type: "list-item",
          },
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "unter Bezug auf die UNCAC die Verbreitung von Korruption und illegalem Handel eingedämmt werden muss, um die Sicherheit und Stabilität des Landes langfristig zu gewährleisten",
                  },
                ],
              },
            ],
            type: "list-item",
          },
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "eine Geberkonferenz ausgerufen wird, in welchem die Aspekte ausgearbeitet und finalisiert werden",
                  },
                ],
              },
            ],
            type: "list-item",
          },
        ],
        type: "ordered-list",
      },
    ];
    const testDataNew = [
      {
        type: "paragraph",
        children: [
          {
            text: "unterstreicht",
            operator: true,
          },
          {
            text: " die Wichtigkeit für Sicherheit und Stabilität, indem",
          },
        ],
      },
      {
        children: [
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "eine Unterstützung bei der Wiederherstellung der öffentlichen und rechtlichen Ordnung durch die Bereitstellung von Ressourcen für die Ausbildung und Ausrüstung der örtlichen Sicherheitskräfte geleistet wird,",
                  },
                ],
              },
              {
                children: [
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "eine Unterstützung bei der Wiederherstellung der öffentlichen und rechtlichen Ordnung durch die Bereitstellung von Ressourcen für die Ausbildung und Ausrüstung der örtlichen Sicherheitskräfte geleistet wird,",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "dringend dazu aufgefordert wird den Dialog zwischen den politischen und der Zivilgesellschaft zu fördern, um friedliche Lösungen für politische und gesellschaftliche Konflikte zu finden und die Demokratie zu stärken,",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "unter Bezug auf die UNCAC die Verbreitung von Korruption und illegalem Handel eingedämmt werden muss, um die Sicherheit und Stabilität des Landes langfristig zu gewährleisten",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                  {
                    children: [
                      {
                        type: "list-item-text",
                        children: [
                          {
                            text: "eine Geberkonferenz ausgerufen wird, in welchem die Aspekte ausgearbeitet und finalisiert werden",
                          },
                        ],
                      },
                    ],
                    type: "list-item",
                  },
                ],
                type: "ordered-list",
              },
            ],
            type: "list-item",
          },
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "dringend dazu aufgefordert wird den Dialog zwischen den politischen Akteuren und der Zivilgesellschaft zu fördern, um friedliche Lösungen für politische und gesellschaftliche Konflikte zu finden und die Demokratie zu stärken,",
                  },
                ],
              },
            ],
            type: "list-item",
          },
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "unter Bezug auf die UNCAC die Verbreitung von Korruption und illegalem Handel eingedämmt werden muss, um die Sicherheit und Stabilität des Landes langfristig zu gewährleisten",
                  },
                ],
              },
            ],
            type: "list-item",
          },
          {
            children: [
              {
                type: "list-item-text",
                children: [
                  {
                    text: "eine Geberkonferenz ausgerufen wird, in welchem die Aspekte ausgearbeitet und finalisiert werden",
                  },
                ],
              },
            ],
            type: "list-item",
          },
        ],
        type: "ordered-list",
      },
      {
        type: "paragraph",
        children: [
          {
            text: "unterstreicht",
            operator: true,
          },
          {
            text: " die Wichtigkeit für Sicherheit und Stabilität",
          },
        ],
      },
    ];

    setOriginalText(serialisation(testDataOld));
    setChangedText(serialisation(testDataNew));
  }, []);

  const headerItems: HeaderItemType[] = [
    {
      icon: faHashtag,
      content: "123",
    },
    {
      icon: faListOl,
      content: "3",
    },
    {
      content: <NormalFlag countryCode="cpv" showNameOnHover />,
    },
    {
      icon: faSignature,
      content: "3",
    },
  ];

  return (
    <>
      <div className="h-screen w-full bg-primary-950 flex flex-col gap-4 justify-between items-center p-4">
        <Headline headerItems={headerItems} />
        <div className="w-full rounded-3xl bg-white flex flex-col gap-4 justify-center items-center p-4 shadow-lg">
          <div className="text-2xl font-bold">Antrag auf Änderung</div>
          <ScrollPanel style={{ width: "100%", maxHeight: "100vh" }}>
            <ReactDiffViewer
              oldValue={originalText}
              newValue={changedText}
              splitView={splitView}
              showDiffOnly={false}
              hideLineNumbers
              compareMethod={DiffMethod.WORDS}
              styles={{
                contentText: {
                  fontFamily: "Times New Roman, Times, var(--font-serif)",
                },
              }}
            />
          </ScrollPanel>
        </div>
        <div className="flex gap-4">
          <Button faIcon={faArrowLeft} text />
          <Button
            label="Ablehnen"
            faIcon={faXmark}
            severity="danger"
            onClick={() => {
              console.log("Ablehnen");
            }}
          />
          <Button
            faIcon={splitView ? faArrowsUpDown : faArrowsLeftRight}
            onClick={() => {
              setSplitView(!splitView);
            }}
          />
          <Button
            label="Annehmen"
            faIcon={faCheck}
            severity="success"
            onClick={() => {
              console.log("Annehmen");
            }}
          />
          <Button faIcon={faArrowRight} text />
        </div>
      </div>
    </>
  );
}

interface HeaderItemType {
  icon?: IconProp;
  content: string | JSX.Element;
}

function Headline({ headerItems }: { headerItems: HeaderItemType[] }) {
  const router = useRouter();

  return (
    <div className="w-full flex gap-4 items-center">
      <Button
        faIcon={faArrowLeft}
        label="Back"
        text
        onClick={() => router.push("../")}
      />
      <InfoHeader headerItems={headerItems} />
      <div className="flex-1" />
      <Button faIcon={faBars} />
    </div>
  );
}

function InfoHeader({ headerItems }: { headerItems: HeaderItemType[] }) {
  return (
    <div className="flex gap-1">
      {headerItems.map((headerItem, index) => (
        <div
          className={`bg-white ${
            index + 1 === headerItems.length ? "rounded-r-lg" : ""
          } ${
            index === 0 ? "rounded-l-lg" : ""
          } py-2 px-4 text-3xl font-mono font-bold shadow-lg`}
        >
          {headerItem.icon && (
            <FontAwesomeIcon className="mr-2 text-lg" icon={headerItem.icon} />
          )}
          {headerItem.content}
        </div>
      ))}
    </div>
  );
}
