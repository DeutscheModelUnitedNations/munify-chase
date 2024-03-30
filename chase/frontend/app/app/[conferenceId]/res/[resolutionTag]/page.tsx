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
  ResDelimiter,
  ClauseType,
} from "@/components/resEditor/clause";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import { Skeleton } from "primereact/skeleton";
import { addDelimiterToClause, checkValidOperator } from "@/misc/res_parser";
import Image from "next/image";
import EditClauseModal from "@/components/resEditor/edit_clause";
import { ScrollTop } from "primereact/scrolltop";

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

interface testDataType {
  tag: ResolutionTagType;
  agendaItem: string;
  organ: string;
  firstSentence: string;
  writer: string;
  sponsors: string[];
  preambleClauses: ClauseType[];
  operativeClauses: ClauseType[];
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

  const [editResModalVisible, setEditResModalVisible] = useState(true);

  useEffect(() => {
    const testData: testDataType = {
      tag: {
        committee: "SR",
        type: ResolutionType.RES,
        session: 2024,
        number: 1,
      },
      agendaItem: "Situation in Haiti",
      writer: "cpv",
      sponsors: ["fra", "deu", "cze", "sur"],
      organ: "Sicherheitsrat",
      firstSentence: "Der Sicherheitsrat",
      preambleClauses: [
        {
          id: "P1",
          number: 1,
          content:
            "<in Bekräftigung> der Resolutionen 1542 (2004), 1944 (2010), 2350 (2017), 2699 (2023) des UN-Sicherheitsrats über Haiti in Erwartung der Unterstützung der Mitglieder der Vereinten Nationen in Hinblick auf die Konfliktsituation in Haiti sowie des Programms BINUH der Vereinten Nationen in Haiti",
        },
        {
          id: "P2",
          number: 2,
          content:
            "betonend, dass dringender Handlungsbedarf besteht, damit langfristig in Haiti auch ohne internationale Unterstützung ein funktionierender demokratischer Staat sowie ein funktionierendes Sicherheitssystem gewährleistet ist",
        },
        {
          id: "P3",
          number: 3,
          content:
            "die nationale Souveränität, territoriale Integrität, Unabhängigkeit und Einheit der Republik Haiti <bekräftigend>",
        },
        {
          id: "P4",
          number: 4,
          content:
            "die Wichtigkeit und die Wahrung der Menschenrechte nach dem Völkerrecht <betonend>",
        },
        {
          id: "P5",
          number: 5,
          content:
            "<beunruhigt>, dass die bisherigen Missionen die Stabilität des Landes beeinträchtigt haben und das Vertrauen der Bevölkerung verloren gegangen ist",
        },
        {
          id: "P6",
          number: 6,
          content:
            "<alarmiert>, dass nach dem Tod des vorherigen Präsidenten Jovenel Moise die Bandenkriminalität exponentiell zugenommen hat und weite Teile des Landes von Banden kontrolliert werden",
        },
        {
          id: "P7",
          number: 7,
          content:
            "<unter Berücksichtigung> der historischen Ereignisse Haitis, besonders der Bedeutung als erster unabhängiger Staat in der Karibik",
        },
        {
          id: "P8",
          number: 8,
          content:
            "<beunruhigt> durch die Zunahme der Gewalt, der kriminellen Tätigkeiten und der Menschenrechtsverletzungen und -übergriffe, die den Frieden, die Stabilität und die Sicherheit Haitis und der Region untergraben;  darunter Entführungen, sexuelle und geschlechtsspezifische Gewalt, Menschenhandel und Migrantenschleusung, Morde, außergerichtliche Tötungen sowie der Schmuggel von Rüstungsgütern, sowie durch deren Schwere und Anzahl",
        },
        {
          id: "P9",
          number: 9,
          content:
            "<erinnernd>, dass durch die sich weiter verschlechternde Situation in Haiti ohne internationale Unterstützung die politische Instabilität im Land weiter zunimmt und die humanitäre Lage sowie die fehlende Nahrung der Bevölkerung einen erheblichen Schaden zufügen",
        },
        {
          id: "P10",
          number: 10,
          content:
            "<unter Berücksichtigung> der dringenden Notwendigkeit, die humanitäre Krise anzugehen und langfristige Lösungen für die politische, wirtschaftliche und soziale Stabilität Haitis zu finden",
        },
      ],
      operativeClauses: [
        {
          id: "O1",
          number: 1,
          content: [
            "<fordert> ein Paket für Soforthilfemaßnahmen, welches beinhaltet, das",
            {
              id: "O1.1",
              number: 1,
              content:
                "lebenswichtige Ressourcen wie Nahrungsmitteln, Wasser, Medikamente und Unterkünfte für die von der aktuellen Krise betroffenen Haitianer geliefert und bereitgestellt werden,",
            },
            {
              id: "O1.2",
              number: 2,
              content:
                "die humanitären Organisationen und internationalen Partnern mobilisiert werden, um die Effizienz und Reichweite der Hilfsmaßnahmen zu maximieren,",
            },
            {
              id: "O1.3",
              number: 3,
              content:
                "Notunterkünfte und medizinischen Einrichtungen zur Versorgung der Verletzten und Kranken eingerichtet werden, um das aktuelle Leid einzugrenzen",
            },
          ],
        },
        {
          id: "O2",
          number: 2,
          content: [
            "<unterstreicht> die Wichtigkeit für Sicherheit und Stabilität, indem",
            {
              id: "O2.1",
              number: 1,
              content:
                "eine Unterstützung bei der Wiederherstellung der öffentlichen und rechtlichen Ordnung durch die Bereitstellung von Ressourcen für die Ausbildung und Ausrüstung der örtlichen Sicherheitskräfte geleistet wird,",
            },
            {
              id: "O2.2",
              number: 2,
              content:
                "dringend dazu aufgefordert wird den Dialog zwischen den politischen Akteuren und der Zivilgesellschaft zu fördern, um friedliche Lösungen für politische Konflikte zu finden und die Demokratie zu stärken",
            },
            {
              id: "O2.3",
              number: 3,
              content:
                "unter Bezug auf die UNCAC die Verbreitung von Korruption und illegalem Handel eingedämmt werden muss, um die Sicherheit und Stabilität des Landes langfristig zu gewährleisten",
            },
            {
              id: "O2.4",
              number: 4,
              content:
                "eine Geberkonferenz ausgerufen wird, in welchem die finanziellen Aspekte ausgearbeitet und finalisiert werden",
            },
          ],
        },
        {
          id: "O3",
          number: 3,
          content:
            "<fordert> alle Akteure <auf> insbesondere Banden und kriminelle Netzwerke, alle Rechtsverletzungen und Missbrauchshandlungen gegenüber Kindern, darunter Tötung und Verstümmelung, Erziehung und Einsatz, Vergewaltigung und andere Formen sexueller und geschlechtsspezifischer Gewalt, insbesondere gegen Mädchen, Angriffe auf Schulen und Krankenhäuser, Entführungen sofort zu beenden und zu verhindern",
        },
        {
          id: "O4",
          number: 4,
          content:
            "<beauftragt> die BINUH den haitianischen Staat beim Aufbau eines funktionierenden politischen Systems zu unterstützen, was lediglich struktureller Natur sein sollte, wobei die inhaltliche und gestalterische Entscheidungsfreiheit einzig der haitianischen Regierung obliegt, wobei beispielsweise eine von mehreren Möglichkeiten zur direkten Beteiligung für das haitianische Volk in der Durchführung von demokratischen Wahlen auf nationaler aber vor allem auch auf lokaler Ebene bestünde, und um eine Regierung zu ernennen, die das Vertrauen und die Anerkennung der Bevölkerung genießt, obwohl es insgesamt das Ziel aller Maßnahmen ist die Übergabe Haitis in die Selbstverwaltung und die Beendigung aller UN-Mandate",
        },
        {
          id: "O5",
          number: 5,
          content:
            "<drängt> auf die Unterstützung der haitianischen Polizei durch Lieferung von Ausrüstung, ausgenommen militärisches Gerät, und durch Schulungen in Zusammenarbeit mit dem BINUH und der geplanten MSS-Mission",
        },
        {
          id: "O6",
          number: 6,
          content: [
            "<beauftragt>, in Bezug auf die oben genannten Herausforderungen, den Inter-Agency Standing Committee (IASC),",
            {
              id: "O6.1",
              number: 1,
              content:
                "Aktivierung des Humanitarian System-Wide Scale-Up Protokolls für einen Zeitraum von sechs Monaten,",
            },
            {
              id: "O6.2",
              number: 2,
              content: [
                "Verteilung folgender Aufgaben auf die Task Forces um die Situation der Bevölkerung zu verbessern und die Hilfen von NGOs und der BINUH zu stärken:",
                {
                  id: "O6.2.1",
                  number: 1,
                  content:
                    "Koordination der humanitären Hilfeleistungen in Haiti und Optimierung der Ressourcennutzung und Vermeidung von Doppelarbeit, unter besonderer Berücksichtigung der Task Force für Lokalisierung, um die Einbindung lokaler und staatlicher Akteure zu stärken,",
                },
                {
                  id: "O6.2.2",
                  number: 2,
                  content:
                    "Führung und Organisation der Zusammenarbeit zwischen allen in Haiti aktiven humanitären Akteuren, unterstützt durch die Task Force für die Zentralität des Schutzes, um den Schutz der betroffenen Bevölkerung zu gewährleisten,",
                },
                {
                  id: "O6.2.3",
                  number: 3,
                  content:
                    "Kontrolle der humanitären Hilfe, wobei die Task Force für Rechenschaftspflicht gegenüber betroffenen Personen sicherstellt, dass die Bedürfnisse und das Feedback der Gemeinschaften berücksichtigt werden, um fehler der vorausgegangen Missionen nicht zu wiederholen,",
                },
                {
                  id: "O6.2.4",
                  number: 4,
                  content:
                    "Beschleunigung der Hilfsmaßnahmen und Sicherstellung, dass die Hilfe die betroffene Bevölkerung erreicht, wobei die Task Force für den Erhalt des humanitären Raums Leitlinien und Werkzeuge zur Überwindung bürokratischer Hindernisse bereitstellt",
                },
              ],
            },
          ],
        },
        {
          id: "O7",
          number: 7,
          content:
            "<betont> die Notwendigkeit des Schutzes von Kindern und Jugendlichen sowie der Sicherung von Bildungsmöglichkeiten",
        },
        {
          id: "O8",
          number: 8,
          content:
            "<betont> die Wichtigkeit der Förderung von Bildung und beruflicher Ausbildung, um der Perspektivlosigkeit von Kindern und Jugendlichen entgegenzuwirken und die langfristige wirtschaftliche Entwicklung und die Schaffung von Arbeitsplätzen zu unterstützen",
        },
        {
          id: "O9",
          number: 9,
          content:
            "<bittet nachdrücklich> um Investitionen in die Infrastruktur Haitis, insbesondere in den resilienten Wiederaufbau von Wohngebieten, Straßen, Schulen und medizinischen Einrichtungen, Nichtregierungsorganisationen und der Zivilgesellschaft, um eine effektive und kohärente Hilfeleistung sicherzustellen und über jene zu wachen",
        },
        {
          id: "O10",
          number: 10,
          content:
            "<hebt> die Bedeutung eines ausreichend ausgebauten und krisensicheren Katastrophenschutzes in Haiti, insbesondere im Bereich der krisensicheren Infrastruktur und des Überflutungsschutzes <hervor>",
        },
        {
          id: "O11",
          number: 11,
          content:
            "<bekräftigt> die Stärkung der Koordination und Zusammenarbeit zwischen den helfenden Regierungen und internationalen Organisationen",
        },
        {
          id: "O12",
          number: 12,
          content:
            "<befürwortet> die Mobilisierung von Ressourcen durch Spenden, Mitgliedsbeiträge, Kredite und die Etablierung von Partnerschaften mit internationalen Organisationen, um Aufbau- und Bildungsprogramme, adäquat zu finanzieren",
        },
        {
          id: "O13",
          number: 13,
          content:
            "<befürwortet> die Unterstützung von nachhaltigen Entwicklungsprojekten, die die Umwelt schützen und das ökologische Gleichgewicht wiederherstellen",
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
        checkValidOperator(
          addDelimiterToClause(ResDelimiter.COMMA, clause),
          "preambleClauses",
        ),
      ),
    );
    setOperativeClauses(
      testData.operativeClauses.map((clause, index) =>
        checkValidOperator(
          addDelimiterToClause(
            index !== testData.operativeClauses.length - 1
              ? ResDelimiter.SEMICOLON
              : ResDelimiter.PERIOD,
            clause,
          ),
          "operativeClauses",
        ),
      ),
    );
  }, []);

  function getResTag() {
    if (!resolutionTag) return null;
    return `${resolutionTag.committee}/${resolutionTag.type}/${resolutionTag.session}/${resolutionTag.number}`;
  }

  function getResTagWithoutCommittee() {
    if (!resolutionTag) return "";
    return `${resolutionTag.type}/${resolutionTag.session}/${resolutionTag.number}`;
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

  return (
    <>
      <EditClauseModal modalVisible={editResModalVisible} closeFunction={() => setEditResModalVisible(false)} />
      <div className="w-full bg-primary-950">
        <Toolbar resolutionTag={getResTag()} openEditModalFunction={() => setEditResModalVisible(true)} />
        <div className="w-full p-4 xl:pl-40 py-20 flex flex-col items-center">
          <PaperWrapper>
            <div className="flex flex-col md:flex-row md:gap-4 justify-between items-end">
              <h2 className="text-lg ml-[110px]">{LL.resolution.UN()}</h2>
              <h2 className="text-lg lining-nums flex flex-row items-end">
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
                  noNumbering={true}
                  onClickFunction={() => console.log("Test")}
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
              {operativeClauses.map((clause) => (
                <Clause
                  clause={clause}
                  key={clause.id}
                  onClickFunction={() => console.log("Test")}
                />
              ))}
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
    <div className="relative mt-2 mb-1">
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
      <h3 className="flex items-center">
        {LL.resolution.header.AGENDA_ITEM().toUpperCase()}:{" "}
        {agendaItem ?? (
          <Skeleton
            width="10rem"
            height="1rem"
            className="!bg-primary-950 ml-1"
          />
        )}
      </h3>
      <h3 className="flex items-center">
        {LL.resolution.header.WRITER().toUpperCase()}:{" "}
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
      <h3 className="flex items-center">
        {LL.resolution.header.SPONSORS().toUpperCase()}:{" "}
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
    </>
  );
}

function PaperWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[800px] shadow-lg rounded p-12 bg-white font-times flex flex-col gap-2">
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
      <div className="flex items-start mb-8">
        <div className="w-20 h-20 flex items-center justify-center">
          <Image src="/misc/un_logo.svg" width={80} height={80} alt="UN Logo" />
        </div>
        <h1 className="text-3xl mt-2 ml-[10px] font-bold">
          {organ ?? (
            <Skeleton width="15rem" height="2rem" className="!bg-primary-950" />
          )}
        </h1>
      </div>
      {children}
      <p className="text-gray-400 mt-8 text-xs">
        {LL.resolution.header.DISCLAIMER()}
      </p>
    </div>
  );
}
