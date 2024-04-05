"use client";
import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Toolbar from "@/components/resEditor/toolbar";
import Clause, {
  ClauseType,
  ClauseTypeEnum,
} from "@/components/resEditor/clause";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { Skeleton } from "primereact/skeleton";
import {
  checkHasValidOperator,
  checkValidOperatorAndAddFlag,
} from "@/misc/res_parser";
import Image from "next/image";
import EditClauseModal from "@/components/resEditor/edit_clause";
import { ScrollTop } from "primereact/scrolltop";
import { Descendant } from "slate";
import { Type as SlateParagraphType } from "@/components/resEditor/slate_types";

enum ResolutionType {
  RES = "RES",
  WP = "WP",
  DRAFT = "DRAFT",
}

interface ResolutionTagType {
  committee: string;
  type: ResolutionType;
  session: number;
  number: number;
}

export interface testDataType {
  tag: ResolutionTagType;
  agendaItem: string;
  organ: string;
  firstSentence: string;
  writer: string;
  sponsors: string[];
  preambleClauses: ClauseType[];
  operativeClauses: ClauseType[];
}

export interface ResDataManipulationType {
  getClauseById: (clauseId: string) => ClauseType | undefined;
  addPreambleClause: () => void;
  addOperativeClause: () => void;
  updateClause: (clauseId: string, newContent: Descendant[]) => void;
  deleteClause: (clauseId: string) => void;
  renumberClauses: () => void;
  printResolution: () => void;
}

export default function ResolutionEditor({
  params,
}: { params: { conferenceId: string; resolutionTag: string } }) {
  const { LL, locale } = useI18nContext();
  const { backend } = useBackend();

  const [resolutionTag, setResolutionTag] = useState<
    ResolutionTagType | undefined
  >();
  const [writer, setWriter] = useState<string>();
  const [sponsors, setSponsors] = useState<string[]>([]);
  const [agendaItem, setAgendaItem] = useState<string>();
  const [organ, setOrgan] = useState<string>();
  const [firstSentence, setFirstSentence] = useState<string>();

  const [preambleClauses, setPreambleClauses] = useState<ClauseType[]>([]);
  const [operativeClauses, setOperativeClauses] = useState<ClauseType[]>([]);

  const [clauseToEdit, setClauseToEdit] = useState<ClauseType | undefined>(
    undefined,
  );

  useEffect(() => {
    const testData: testDataType = {
      tag: {
        committee: "GV",
        type: ResolutionType.RES,
        session: 2024,
        number: 1,
      },
      agendaItem: "Situation in Haiti",
      writer: "cpv",
      sponsors: ["fra", "deu", "cze", "sur"],
      organ: "Generalversammlung",
      firstSentence: "Die Generalversammlung",
      preambleClauses: [
        {
          id: "P0",
          number: 1,
          type: ClauseTypeEnum.PREAMBLE,
          content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "in Bekräftigung",
                  operator: true,
                },
                {
                  text: " der Resolutionen 1542 (2004), 1944 (2010), 2350 (2017), 2699 (2023) des UN-Sicherheitsrats über Haiti in Erwartung der Unterstützung der Mitglieder der Vereinten Nationen in Hinblick auf die Konfliktsituation in Haiti sowie des Programms BINUH der Vereinten Nationen in Haiti",
                },
              ],
            },
          ],
        },
        {
          id: "P1",
          number: 2,
          type: ClauseTypeEnum.PREAMBLE,
          content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "anerkennend",
                  operator: true,
                },
                {
                  text: ", dass dringender Handlungsbedarf besteht, damit langfristig in Haiti auch ohne internationale Unterstützung ein funktionierender demokratischer Staat sowie ein funktionierendes Sicherheitssystem gewährleistet ist",
                },
              ],
            },
          ],
        },
        {
          id: "P2",
          number: 3,
          type: ClauseTypeEnum.PREAMBLE,
          content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "die nationale Souveränität, territoriale Integrität, Unabhängigkeit und Einheit der Republik Haiti ",
                },
                {
                  text: "bekräftigend",
                  operator: true,
                },
              ],
            },
          ],
        },
      ],
      operativeClauses: [
        {
          id: "O0",
          number: 1,
          type: ClauseTypeEnum.OPERATIVE,
          content: [
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
                  ],
                  type: "list-item",
                },
                {
                  children: [
                    {
                      type: "list-item-text",
                      children: [
                        {
                          text: "dringend dazu aufgefordert wird den Dialog zwischen den politischen Akteuren und der Zivilgesellschaft zu fördern, um friedliche Lösungen für politische Konflikte zu finden und die Demokratie zu stärken,",
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
                          text: "eine Geberkonferenz ausgerufen wird, in welchem die finanziellen Aspekte ausgearbeitet und finalisiert werden",
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
        },
        {
          id: "O2",
          number: 3,
          type: ClauseTypeEnum.OPERATIVE,
          content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "fordert",
                  operator: true,
                },
                {
                  text: " ein Paket für Soforthilfemaßnahmen, welches beinhaltet, dass",
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
                          text: "lebenswichtige Ressourcen wie Nahrungsmitteln, Wasser, Medikamente und Unterkünfte für die von der aktuellen Krise betroffenen Haitianer geliefert und bereitgestellt werden,",
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
                          text: " die humanitären Organisationen und internationalen Partnern mobilisiert werden, um die Effizienz und Reichweite der Hilfsmaßnahmen zu maximieren,",
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
                          text: "Notunterkünfte und medizinischen Einrichtungen zur Versorgung der Verletzten und Kranken eingerichtet werden, um das aktuelle Leid einzugrenzen",
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
        },
        {
          id: "O3",
          number: 4,
          type: ClauseTypeEnum.OPERATIVE,
          content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "fordert",
                  operator: true,
                },
                {
                  text: " ein Paket für Soforthilfemaßnahmen, welches beinhaltet, dass",
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
                          text: "lebenswichtige Ressourcen wie Nahrungsmitteln, Wasser, Medikamente und Unterkünfte für die von der aktuellen Krise betroffenen Haitianer geliefert und bereitgestellt werden,",
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
                          text: " die humanitären Organisationen und internationalen Partnern mobilisiert werden, um die Effizienz und Reichweite der Hilfsmaßnahmen zu maximieren,",
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
                          text: "Notunterkünfte und medizinischen Einrichtungen zur Versorgung der Verletzten und Kranken eingerichtet werden, um das aktuelle Leid einzugrenzen",
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
        },
        {
          id: "O1",
          number: 2,
          type: ClauseTypeEnum.OPERATIVE,
          content: [
            {
              type: "paragraph",
              children: [
                {
                  text: "fordert",
                  operator: true,
                },
                {
                  text: " ein Paket für Soforthilfemaßnahmen, welches beinhaltet, dass",
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
                          text: "lebenswichtige Ressourcen wie Nahrungsmitteln, Wasser, Medikamente und Unterkünfte für die von der aktuellen Krise betroffenen Haitianer geliefert und bereitgestellt werden,",
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
                          text: " die humanitären Organisationen und internationalen Partnern mobilisiert werden, um die Effizienz und Reichweite der Hilfsmaßnahmen zu maximieren,",
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
                          text: "Notunterkünfte und medizinischen Einrichtungen zur Versorgung der Verletzten und Kranken eingerichtet werden, um das aktuelle Leid einzugrenzen",
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
        },
      ],
    };

    setResolutionTag(testData.tag);
    setAgendaItem(testData.agendaItem);
    setOrgan(testData.organ);
    setFirstSentence(testData.firstSentence);
    setWriter(testData.writer);
    setSponsors(testData.sponsors);
    setPreambleClauses(
      testData.preambleClauses.map((clause) =>
        checkValidOperatorAndAddFlag(clause, ClauseTypeEnum.PREAMBLE),
      ),
    );
    setOperativeClauses(
      testData.operativeClauses.map((clause) =>
        checkValidOperatorAndAddFlag(clause, ClauseTypeEnum.OPERATIVE),
      ),
    );
  }, []);

  function getResTag() {
    if (!resolutionTag) return null;
    return `${resolutionTag.committee}/${resolutionTag.type}/${resolutionTag.number} (${resolutionTag.session})`;
  }

  function getResTagWithoutCommittee() {
    if (!resolutionTag) return "";
    return `${resolutionTag.type}/${resolutionTag.number} (${resolutionTag.session})`;
  }

  function handlePreambleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPreambleClauses((preambleClauses) => {
        const oldIndex = preambleClauses
          .map((clause) => clause.id)
          .indexOf(active.id);
        const newIndex = preambleClauses
          .map((clause) => clause.id)
          .indexOf(over.id);

        return arrayMove(preambleClauses, oldIndex, newIndex);
      });
    }
  }

  function handleOperativeDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setOperativeClauses((operativeClauses) => {
        const oldIndex = operativeClauses
          .map((clause) => clause.id)
          .indexOf(active.id);
        const newIndex = operativeClauses
          .map((clause) => clause.id)
          .indexOf(over.id);

        return arrayMove(operativeClauses, oldIndex, newIndex);
      });
    }
  }

  const ResDataManipulation: ResDataManipulationType = {
    getClauseById: (clauseId: string) => {
      const allClauses = [...preambleClauses, ...operativeClauses];
      return allClauses.find((clause) => clause.id === clauseId);
    },

    addPreambleClause: () => {
      const newClause: ClauseType = {
        id: `P${preambleClauses.length + 1}`,
        number: preambleClauses.length + 1,
        type: ClauseTypeEnum.PREAMBLE,
        content: [
          { type: SlateParagraphType.PARAGRAPH, children: [{ text: "" }] },
        ],
      };

      setPreambleClauses((preambleClauses) => [...preambleClauses, newClause]);
      setClauseToEdit(newClause);
    },

    addOperativeClause: () => {
      const newClause: ClauseType = {
        id: `O${operativeClauses.length + 1}`,
        number: operativeClauses.length + 1,
        type: ClauseTypeEnum.OPERATIVE,
        content: [
          { type: SlateParagraphType.PARAGRAPH, children: [{ text: "" }] },
        ],
      };

      setOperativeClauses((operativeClauses) => [
        ...operativeClauses,
        newClause,
      ]);
      setClauseToEdit(newClause);
    },

    updateClause: (clauseId: string, newContent: Descendant[]) => {
      const clauseToUpdate = ResDataManipulation.getClauseById(clauseId);
      if (!clauseToUpdate) return;
      const updatedClause = { ...clauseToUpdate, content: newContent };

      if (clauseToUpdate.type === ClauseTypeEnum.PREAMBLE) {
        setPreambleClauses((preambleClauses) =>
          preambleClauses.map((clause) => {
            if (clause.id === clauseId) {
              return {
                ...updatedClause,
                validOperator: checkHasValidOperator(
                  updatedClause.content,
                  clause.type,
                ),
              };
            }
            return clause;
          }),
        );
      } else {
        setOperativeClauses((operativeClauses) =>
          operativeClauses.map((clause) => {
            if (clause.id === clauseId) {
              return {
                ...updatedClause,
                validOperator: checkHasValidOperator(
                  updatedClause.content,
                  clause.type,
                ),
              };
            }
            return clause;
          }),
        );
      }
    },

    deleteClause: (clauseId: string) => {
      const clauseToDelete = ResDataManipulation.getClauseById(clauseId);
      if (!clauseToDelete) return;

      if (clauseToDelete.type === ClauseTypeEnum.PREAMBLE) {
        setPreambleClauses((preambleClauses) =>
          preambleClauses.filter((clause) => clause.id !== clauseId),
        );
      } else {
        setOperativeClauses((operativeClauses) =>
          operativeClauses.filter((clause) => clause.id !== clauseId),
        );
      }
    },

    renumberClauses: () => {
      const renumberedPreambleClauses = preambleClauses.map(
        (clause, index) => ({
          ...clause,
          number: index + 1,
        }),
      );

      const renumberedOperativeClauses = operativeClauses.map(
        (clause, index) => ({
          ...clause,
          number: index + 1,
        }),
      );

      setPreambleClauses(renumberedPreambleClauses);
      setOperativeClauses(renumberedOperativeClauses);
    },

    printResolution: () => {
      if (!window) return;
      window.print();
    },
  };

  return (
    <>
      <EditClauseModal
        clause={clauseToEdit}
        closeFunction={() => {
          setClauseToEdit(undefined);
        }}
        resDataManipulation={ResDataManipulation}
      />
      <div className="w-full bg-primary-950 print:bg-white print:m-0">
        <Toolbar resDataManipulation={ResDataManipulation} />
        <div className="w-full p-4 xl:pl-40 py-20 print:p-0 flex flex-col items-center">
          <PaperWrapper>
            <div className="flex flex-col sm:flex-row md:gap-4 justify-between items-end">
              <h2 className="text-lg ml-[110px]">{LL.resolution.UN()}</h2>
              <h2 className="lining-nums flex flex-row items-end">
                <span className="text-3xl">
                  {resolutionTag?.committee ? (
                    resolutionTag.committee
                  ) : (
                    <Skeleton
                      width="2.25rem"
                      height="2.25rem"
                      className="!bg-primary-950"
                    />
                  )}
                </span>
                {resolutionTag ? (
                  <>/{getResTagWithoutCommittee()}</>
                ) : (
                  <Skeleton
                    width="6rem"
                    height="1.125rem"
                    className="!bg-primary-950 ml-1"
                  />
                )}
              </h2>
            </div>
            <div className="border-b border-black w-full" />

            <InfoSection organ={organ}>
              <ResolutionHeaderInfoBlock
                agendaItem={agendaItem}
                writer={writer}
                sponsors={sponsors}
              />
            </InfoSection>

            <div className="border-b border-black border-2 w-full mt-4" />

            <h1 className="text-xl font-bold mx-4 mt-2">
              {LL.resolution.header.RESOLUTION()} {resolutionTag?.number} (
              {resolutionTag?.session})
            </h1>

            <FirstSentence>{firstSentence}</FirstSentence>

            <SectionDivider title={LL.resolution.PREAMBLE().toUpperCase()} />

            <ResSection
              items={preambleClauses}
              handleDragEnd={handlePreambleDragEnd}
            >
              {preambleClauses.map((clause) => (
                <Clause
                  clause={clause}
                  key={clause.id}
                  onClickFunction={() => setClauseToEdit(clause)}
                />
              ))}
              {preambleClauses.length === 0 && (
                <Skeleton
                  width="100%"
                  height="5rem"
                  className="!bg-primary-950 mx-4"
                />
              )}
            </ResSection>

            <SectionDivider
              title={LL.resolution.OPERATIVE_SECTION().toUpperCase()}
            />

            <ResSection
              items={operativeClauses}
              handleDragEnd={handleOperativeDragEnd}
            >
              {operativeClauses.map((clause, index) => {
                return (
                  <Clause
                    clause={clause}
                    key={clause.id}
                    onClickFunction={() => setClauseToEdit(clause)}
                    isLastClause={index === operativeClauses.length - 1}
                  />
                );
              })}
              {operativeClauses.length === 0 && (
                <Skeleton
                  width="100%"
                  height="5rem"
                  className="!bg-primary-950 mx-4"
                />
              )}
            </ResSection>
          </PaperWrapper>
        </div>
      </div>
      <ScrollTop />
    </>
  );
}

function ResSection({
  items,
  handleDragEnd,
  children,
}: {
  items: ClauseType[];
  handleDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="relative mt-2 mb-1 print:hidden">
      <div className="border-b w-full border-dashed border-primary-500" />
      <h5 className="absolute top-1/2 -translate-y-1/2 z-20 px-1 right-4 text-xs bg-white text-primary-500 font-bold font-sans">
        {title}
      </h5>
    </div>
  );
}

function FirstSentence({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mx-4 flex items-center mt-8 indent-10 italic">
      {children ? (
        `${children},`
      ) : (
        <Skeleton
          width="10rem"
          height="1rem"
          className="!bg-primary-950 ml-10"
        />
      )}
    </h3>
  );
}

function ResolutionHeaderInfoBlock({
  agendaItem,
  writer,
  sponsors,
}: {
  agendaItem?: string;
  writer?: string;
  sponsors?: string[];
}) {
  const { LL, locale } = useI18nContext();
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h3>{LL.resolution.header.AGENDA_ITEM().toUpperCase()}:</h3>
          <h3 className="indent-10">
            {agendaItem ?? (
              <Skeleton
                width="10rem"
                height="1rem"
                className="!bg-primary-950 ml-1"
              />
            )}
          </h3>
        </div>
        <div className="flex flex-col">
          <h3 className="flex items-center">
            {LL.resolution.header.WRITER().toUpperCase()}:
          </h3>
          <h3 className="indent-10">
            {writer ? (
              getCountryNameByCode(writer, locale)
            ) : (
              <Skeleton
                width="10rem"
                height="1rem"
                className="!bg-primary-950 ml-1"
              />
            )}
          </h3>
        </div>
        <div className="flex flex-col">
          <h3>{LL.resolution.header.SPONSORS().toUpperCase()}:</h3>
          <h3 className="indent-10">
            {sponsors && sponsors.length !== 0 ? (
              sponsors
                .sort((a, b) =>
                  getCountryNameByCode(a, locale).localeCompare(
                    getCountryNameByCode(b, locale),
                  ),
                )
                .map((item, index) => {
                  return `${getCountryNameByCode(item.toUpperCase(), locale)}${
                    index + 1 < sponsors.length ? ", " : ""
                  }`;
                })
            ) : (
              <Skeleton
                width="10rem"
                height="1rem"
                className="!bg-primary-950 ml-1"
              />
            )}
          </h3>
        </div>
      </div>
    </>
  );
}

function PaperWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full screen:max-w-[800px] screen:shadow-lg rounded p-12 print:p-0 bg-white font-times flex flex-col gap-2">
      {children}
    </div>
  );
}

function InfoSection({
  organ,
  children,
}: { organ?: string; children: React.ReactNode }) {
  const { LL } = useI18nContext();

  return (
    <div className="mx-4">
      <div className="flex flex-col sm:flex-row items-start">
        <div className="w-32 h-32 print:contents">
          <Image src="/misc/un_logo.svg" width={80} height={80} alt="UN Logo" />
        </div>
        <div className="ml-[10px] flex flex-col gap-2">
          <h1 className="text-3xl mt-2 mb-10 font-bold">
            {organ ?? (
              <Skeleton
                width="15rem"
                height="2rem"
                className="!bg-primary-950"
              />
            )}
          </h1>
          {children}
          <p className="text-gray-400 mt-8 text-xs">
            {LL.resolution.header.DISCLAIMER()}
          </p>
        </div>
      </div>
    </div>
  );
}
