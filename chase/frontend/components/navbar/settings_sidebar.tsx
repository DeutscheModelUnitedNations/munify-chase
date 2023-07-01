import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Card } from "primereact/card";
import { SelectButton } from "primereact/selectbutton";
import { classNames } from "primereact/utils";

interface ColormodeOption {
  name: string;
  icon: string;
  value: string;
}

interface SettingsSidebarProps {
  settingsSidebarVisible: boolean;
  setSettingsSidebarVisible: (visible: boolean) => void;
}

/**
 * This Component is the sidebar that is displayed when the user clicks on the settings icon in the navbar.
 * It displays the settings of the user, which are:
 * - Colortheme
 * - Language
 * - ...
 * TODO: add more settings
 * TODO: add functionality to change settings
 * TODO: add functionality to save settings
 * TODO: add functionality to reset settings
 */

export default function SettingsSidebar({
  settingsSidebarVisible,
  setSettingsSidebarVisible,
}: SettingsSidebarProps) {
  const colortheme_items: ColormodeOption[] = [
    { name: "Hell", icon: "pi pi-sun", value: "light" },
    { name: "Dunkel", icon: "pi pi-moon", value: "dark" },
    { name: "System", icon: "pi pi-circle-on", value: "system" },
  ];

  const [colortheme, setColortheme] = useState("light");

  const colorModeTemplate = (option: ColormodeOption) => {
    return (
      <>
        <span className={option.icon} />
        <span className="p-ml-2 ml-2">{option.name}</span>
      </>
    );
  };

  useEffect(() => {
    if (colortheme === "system") {
      // TODO: Implement system color theme
      document.documentElement.classList.remove("dark");
    } else if (colortheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [colortheme]);

  return (
    <Sidebar
      visible={settingsSidebarVisible}
      onHide={() => setSettingsSidebarVisible(false)}
      className="bg-gray-light" // TODO: Not working
    >
      {/* TODO Settings */}
      <Card title="Color Mode">
        <SelectButton
          value={colortheme}
          onChange={(e) => {
            setColortheme(e.value);
          }}
          itemTemplate={colorModeTemplate}
          optionLabel="Color Theme"
          options={colortheme_items}
        />
      </Card>
    </Sidebar>
  );
}
