import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { SelectButton } from "primereact/selectbutton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faCircleHalfStroke,
  faDisplay,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

interface ColormodeOption {
  name: string;
  icon: IconDefinition;
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
    {
      name: "Hell",
      icon: faSun,
      value: "light",
    },
    {
      name: "Dunkel",
      icon: faMoon,
      value: "dark",
    },
    {
      name: "System",
      icon: faDisplay,
      value: "system",
    },
    {
      name: "Hoher Kontrast",
      icon: faCircleHalfStroke,
      value: "contrast",
    },
  ];

  const [colortheme, setColortheme] = useState("system");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handleChange);
    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  const colorModeTemplate = (option: ColormodeOption) => {
    return (
      <>
        <FontAwesomeIcon icon={option.icon} className="mr-2" />
        <span className="p-ml-2 ml-2">{option.name}</span>
      </>
    );
  };

  useEffect(() => {
    if (colortheme === "system") {
      document.documentElement.classList.remove("contrast");
      if (isDarkMode) {
        console.log("dark");
        document.documentElement.classList.add("dark");
      } else {
        console.log("light");
        document.documentElement.classList.remove("dark");
      }
    } else if (colortheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("contrast");
    } else if (colortheme === "contrast") {
      document.documentElement.classList.add("contrast");
      document.documentElement.classList.remove("dark");
    } else if (colortheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("contrast");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("contrast");
      console.error(`Invalid colortheme: ${colortheme}`);
    }
  }, [colortheme, isDarkMode]);

  return (
    <Sidebar
      visible={settingsSidebarVisible}
      onHide={() => setSettingsSidebarVisible(false)}
      position="top"
    >
      {/* TODO Settings */}
      <div className="flex w-full justify-center items-center pt-2">
        <SelectButton
          value={colortheme}
          onChange={(e) => {
            setColortheme(e.value);
          }}
          itemTemplate={colorModeTemplate}
          optionLabel="Color Theme"
          options={colortheme_items}
        />
      </div>
    </Sidebar>
  );
}
