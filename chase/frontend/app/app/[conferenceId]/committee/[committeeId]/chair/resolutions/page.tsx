"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { NormalFlag, SmallFlag } from "@/components/flag_templates";
import NoDataPlaceholder from "@/components/no_data_placeholder";
import SmallInfoCard from "@/components/small_info_card";
import { useI18nContext } from "@/i18n/i18n-react";
import getCountryNameByCode from "@/misc/get_country_name_by_code";
import {
  IconDefinition,
  faChartPie,
  faCircleDashed,
  faEllipsis,
  faFileAward,
  faFileContract,
  faFileDashedLine,
  faFilePen,
  faFlag,
  faMinusCircle,
  faPlusCircle,
  faSignature,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScrollPanel } from "primereact/scrollpanel";
import { ContextMenu } from "primereact/contextmenu";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";
import { ConferenceIdContext } from "@/contexts/committee_data";

export default function ChairResolution() {
  const { LL } = useI18nContext();

  const [workingPapers, setWorkingPapers] = useState([
    {
      id: 1,
      tag: "GV/WP/2024/1",
      submitter: "cpv",
      signatories: ["deu", "fra", "usa"],
      submitted_at: new Date(),
      signatories_changed_at: new Date(),
    },
    {
      id: 2,
      tag: "GV/WP/2024/2",
      submitter: "fra",
      signatories: ["deu", "usa", "rus", "chn"],
      submitted_at: new Date(),
      signatories_changed_at: new Date(),
    },
    {
      id: 3,
      tag: "GV/WP/2024/3",
      submitter: "cze",
      signatories: ["deu", "fra", "usa"],
      submitted_at: new Date(),
      signatories_changed_at: new Date(),
    },
  ]);
  const [draftResolutions, setDraftResolutions] = useState([
    {
      id: 5,
      tag: "GV/ENTWURF/2024/1",
      submitter: "fra",
      signatories: ["deu", "usa", "rus", "chn"],
      ammendments: ["x", "y", "z"],
    },
    {
      id: 5,
      tag: "GV/ENTWURF/2024/1",
      submitter: "rus",
      signatories: ["deu", "fra", "usa"],
      ammendments: [],
    },
  ]);
  const [resolutions, setResolutions] = useState([
    {
      id: 4,
      tag: "GV/RES/2024/1",
      for: 181,
      against: 3,
      abstain: 8,
      adopted_at: new Date(),
    },
  ]);

  return (
    <ScrollPanel style={{ width: "100%", height: "100%" }}>
      <div className="w-full flex flex-col-reverse xl:flex-row p-4 gap-4">
        <Column
          title={LL.resolutionEditor.chairDashboard.HEADLINE_WORKING_PAPERS()}
          subtitle={LL.resolutionEditor.chairDashboard.DESCRIPTION_WORKING_PAPERS()}
          icon={faFilePen}
        >
          {workingPapers.map((wp) => (
            <WorkingPaperCard resolutionData={wp} />
          ))}
        </Column>
        <Column
          title={LL.resolutionEditor.chairDashboard.HEADLINE_DRAFT_RESOLUTIONS()}
          subtitle={LL.resolutionEditor.chairDashboard.DESCRIPTION_DRAFT_RESOLUTIONS()}
          icon={faFileContract}
          noData={draftResolutions.length === 0}
        >
          {draftResolutions.map((r) => (
            <DraftResolutionCard resolutionData={r} />
          ))}
        </Column>
        <Column
          title={LL.resolutionEditor.chairDashboard.HEADLINE_RESOLUTIONS()}
          subtitle={LL.resolutionEditor.chairDashboard.DESCRIPTION_RESOLUTIONS()}
          icon={faFileAward}
        >
          {resolutions.map((r) => (
            <AdoptedResolutionCard resolutionData={r} />
          ))}
        </Column>
      </div>
    </ScrollPanel>
  );
}

function Column({
  title,
  subtitle,
  icon,
  noData = false,
  children,
}: {
  title: string;
  subtitle: string;
  icon: IconDefinition;
  noData?: boolean;
  children: React.ReactNode;
}) {
  const { LL } = useI18nContext();

  return (
    <div className="w-full xl:w-1/3 flex flex-col gap-4 p-4 bg-primary-950 rounded-xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={icon} className="text-primary-50 text-2xl" />
          <h1 className="text-primary-50 text-lg font-bold">{title}</h1>
        </div>
        <p className="text-primary-300 text-sm">{subtitle}</p>
      </div>
      {children}
      {noData && (
        <div className="h-60">
          <NoDataPlaceholder
            title={LL.resolutionEditor.chairDashboard.NO_DATA()}
          />
        </div>
      )}
    </div>
  );
}

function WorkingPaperCard({ resolutionData }: { resolutionData: any }) {
  const { LL, locale } = useI18nContext();
  const menu = useRef<ContextMenu>(null);

  const items: MenuItem[] = [
    { label: "Copy", icon: "pi pi-copy" },
    { label: "Rename", icon: "pi pi-file-edit" },
  ];

  return (
    <ResCard
      tag={resolutionData.tag}
      openMenuFunction={(e) => menu.current?.show(e)}
    >
      <SmallInfoCard icon={faFlag}>
        <SmallFlag countryCode={resolutionData.submitter} />
        <div className="text-primary-50 font-bold ml-2 truncate">
          {getCountryNameByCode(resolutionData.submitter, locale)}
        </div>
      </SmallInfoCard>
      <SmallInfoCard icon={faSignature}>
        <span className="font-bold truncate">
          {resolutionData.signatories.length}{" "}
          {LL.resolutionEditor.chairDashboard.SIGNATORIES()}
        </span>
      </SmallInfoCard>
      <div className="text-sm text-primary-300 mt-2">
        {LL.resolutionEditor.chairDashboard.SUBMITTED_AT({
          date: resolutionData.submitted_at.toLocaleDateString(),
          time: resolutionData.submitted_at.toLocaleTimeString(),
        })}
      </div>
      <div className="text-sm text-primary-300">
        {LL.resolutionEditor.chairDashboard.SIGNATORIES_CHANGED_AT({
          date: resolutionData.submitted_at.toLocaleDateString(),
          time: resolutionData.submitted_at.toLocaleTimeString(),
        })}
      </div>
      <ContextMenu model={items} ref={menu} breakpoint="767px" />
    </ResCard>
  );
}

function DraftResolutionCard({ resolutionData }: { resolutionData: any }) {
  const { LL, locale } = useI18nContext();

  return (
    <ResCard tag={resolutionData.tag}>
      <SmallInfoCard
        icon={faFileDashedLine}
        classNameForIconBox={
          resolutionData.ammendments.length !== 0
            ? "bg-red-500 text-red-500 border-red-500"
            : undefined
        }
      >
        <span className="font-bold truncate">
          {resolutionData.ammendments.length}{" "}
          {LL.resolutionEditor.chairDashboard.AMENDMENTS()}
        </span>
      </SmallInfoCard>
      <SmallInfoCard icon={faFlag}>
        <SmallFlag countryCode={resolutionData.submitter} />
        <div className="text-primary-50 font-bold ml-2 truncate">
          {getCountryNameByCode(resolutionData.submitter, locale)}
        </div>
      </SmallInfoCard>
      <SmallInfoCard icon={faSignature}>
        <span className="font-bold truncate">
          {resolutionData.signatories.length}{" "}
          {LL.resolutionEditor.chairDashboard.SIGNATORIES()}
        </span>
      </SmallInfoCard>
    </ResCard>
  );
}

function AdoptedResolutionCard({ resolutionData }: { resolutionData: any }) {
  const { LL } = useI18nContext();

  const Vote = ({ icon, count }: { icon: IconDefinition; count: number }) => (
    <div className="flex items-center gap-4">
      <FontAwesomeIcon icon={icon} className="text-2xl" />
      <h1 className="text-lg font-bold">{count}</h1>
    </div>
  );

  return (
    <ResCard tag={resolutionData.tag}>
      <SmallInfoCard
        icon={faChartPie}
        classNameForIconBox="bg-green-700 text-green-700 border-green-700"
      >
        <div className="flex flex-col gap-2">
          <Vote icon={faPlusCircle} count={resolutionData.for} />
          <Vote icon={faMinusCircle} count={resolutionData.against} />
          <Vote icon={faCircleDashed} count={resolutionData.abstain} />
        </div>
      </SmallInfoCard>
      <div className="text-sm text-primary-300 mt-2">
        {LL.resolutionEditor.chairDashboard.ADOPTED_AT({
          date: resolutionData.adopted_at.toLocaleDateString(),
          time: resolutionData.adopted_at.toLocaleTimeString(),
        })}
      </div>
    </ResCard>
  );
}

function ResCard({
  tag,
  openMenuFunction,
  children,
}: {
  tag: string;
  openMenuFunction?: (e: React.SyntheticEvent) => void;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const conferenceId = useContext(ConferenceIdContext);

  return (
    <div
      className="flex flex-col gap-2 bg-primary-900 p-4 rounded-lg pophover cursor-pointer"
      onContextMenu={(e) => openMenuFunction?.(e)}
      onClick={() =>
        router.push(`/app/${conferenceId}/res/${encodeURIComponent(tag)}`)
      }
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-primary-50 font-bold text-lg">{tag}</h1>
        {openMenuFunction && (
          <div
            className="px-2 hover:scale-150 transition-all duration-300 cursor:menu"
            onClick={(e) => openMenuFunction(e)}
            onKeyDown={(e) => openMenuFunction(e)}
          >
            <FontAwesomeIcon icon={faEllipsis} className="text-primary-300" />
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
