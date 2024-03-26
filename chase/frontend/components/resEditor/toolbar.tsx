import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAsterisk,
  faExclamation,
  faFile,
  faFileContract,
  faFilePen,
  faListNumeric,
  faPaperPlane,
  faPlus,
  faShareNodes,
  faWrench,
} from "@fortawesome/pro-solid-svg-icons";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";

export default function Toolbar({
  resolutionTag,
}: {
  resolutionTag: string;
}) {
  const { LL } = useI18nContext();

  const items: MenuItem[] = [
    {
      label: LL.resolutionEditor.editor.toolbar.FILE(),
      icon: <FontAwesomeIcon icon={faFile} className="mr-2" />,
      items: [
        {
          label: LL.resolutionEditor.editor.toolbar.FILE_RENAME(),
          icon: <FontAwesomeIcon icon={faFilePen} className="mr-4" />,
        },
      ],
    },
    {
      label: LL.resolutionEditor.editor.toolbar.INSERT(),
      icon: <FontAwesomeIcon icon={faPlus} className="mr-2" />,
      items: [
        {
          label: LL.resolutionEditor.editor.toolbar.INSERT_PREABLE(),
          icon: <FontAwesomeIcon icon={faAsterisk} className="mr-4" />,
        },
        {
          label: LL.resolutionEditor.editor.toolbar.INSERT_OPERATIVE(),
          icon: <FontAwesomeIcon icon={faExclamation} className="mr-4" />,
        },
      ],
    },
    {
      label: LL.resolutionEditor.editor.toolbar.TOOLS(),
      icon: <FontAwesomeIcon icon={faWrench} className="mr-2" />,
      items: [
        {
          label: LL.resolutionEditor.editor.toolbar.TOOLS_RENUMBER(),
          icon: <FontAwesomeIcon icon={faListNumeric} className="mr-4" />,
        },
      ],
    },
    {
      label: LL.resolutionEditor.editor.toolbar.SHARE(),
      icon: <FontAwesomeIcon icon={faShareNodes} className="mr-2" />,
    },
    {
      label: LL.resolutionEditor.editor.toolbar.SUBMISSION(),
      icon: <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />,
    },
  ];

  return (
    <div className="p-8 w-full sticky top-0 bg-white shadow-md z-50">
      <div className="flex gap-8 items-center">
        <FontAwesomeIcon icon={faFileContract} className="text-6xl" />
        <div className="flex flex-col w-full gap-2">
          <h1 className="text-3xl font-bold font-mono">{resolutionTag}</h1>
          <Menubar model={items} className="w-full" />
        </div>
      </div>
    </div>
  );
}
