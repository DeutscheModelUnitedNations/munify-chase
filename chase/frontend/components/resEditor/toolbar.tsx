import React, { useState, useEffect, useRef } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faAsterisk,
  faBars,
  faExclamation,
  faFile,
  faFileContract,
  faFilePen,
  faListNumeric,
  faPaperPlane,
  faPlus,
  faPrint,
  faShareNodes,
  faWrench,
} from "@fortawesome/pro-solid-svg-icons";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { Skeleton } from "primereact/skeleton";
import { TieredMenu } from "primereact/tieredmenu";
import Button from "../button";

export default function Toolbar({
  resolutionTag,
  openEditModalFunction,
}: {
  resolutionTag: string | undefined | null;
  openEditModalFunction: () => void;
}) {
  const { LL } = useI18nContext();

  const tieredMenu = useRef(null);

  const MenuIcon = ({ icon }: { icon: IconDefinition }) => {
    return (
      <div className="w-8 h-full pr-4 flex justify-center items-center">
        <FontAwesomeIcon icon={icon} />
      </div>
    );
  };

  const items: MenuItem[] = [
    {
      label: LL.resolutionEditor.editor.toolbar.FILE(),
      icon: <MenuIcon icon={faFile} />,
      items: [
        {
          label: LL.resolutionEditor.editor.toolbar.FILE_RENAME(),
          icon: <MenuIcon icon={faFilePen} />,
        },
        {
          label: LL.resolutionEditor.editor.toolbar.FILE_PRINT(),
          icon: <MenuIcon icon={faPrint} />,
        },
      ],
    },
    {
      label: LL.resolutionEditor.editor.toolbar.INSERT(),
      icon: <MenuIcon icon={faPlus} />,
      items: [
        {
          label: LL.resolutionEditor.editor.toolbar.INSERT_PREABLE(),
          icon: <MenuIcon icon={faAsterisk} />,
        },
        {
          label: LL.resolutionEditor.editor.toolbar.INSERT_OPERATIVE(),
          icon: <MenuIcon icon={faExclamation} />,
        },
      ],
    },
    {
      label: LL.resolutionEditor.editor.toolbar.TOOLS(),
      icon: <MenuIcon icon={faWrench} />,
      items: [
        {
          label: LL.resolutionEditor.editor.toolbar.TOOLS_RENUMBER(),
          icon: <MenuIcon icon={faListNumeric} />,
        },
      ],
    },
    {
      label: LL.resolutionEditor.editor.toolbar.SHARE(),
      icon: <MenuIcon icon={faShareNodes} />,
    },
    {
      label: LL.resolutionEditor.editor.toolbar.SUBMISSION(),
      icon: <MenuIcon icon={faPaperPlane} />,
    },
  ];

  return (
  <>
    <div className="w-full p-8 fixed top-0 flex xl:hidden z-50">
      <Button
        faIcon={faBars}
        onClick={(e) => tieredMenu.current?.toggle(e)}
        />
      <TieredMenu model={items} popup ref={tieredMenu} breakpoint="500px" />
    </div>
    <div className="p-8 fixed top-0 hidden xl:flex z-50">
    <TieredMenu model={items} breakpoint="500px" />
    </div>
  </>
  );
}
