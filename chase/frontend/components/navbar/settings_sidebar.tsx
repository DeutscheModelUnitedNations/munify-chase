import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { SelectButton } from "primereact/selectbutton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faCircleHalfStroke,
  faDisplay,
  faFloppyDisk,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";

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
      name: "System",
      icon: faDisplay,
      value: "system",
    },
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
      name: "Hoher Kontrast",
      icon: faCircleHalfStroke,
      value: "contrast",
    },
  ];

  const [colortheme, setColortheme] = useState(
    localStorage.getItem("theme") || "system",
  );
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "system",
  );

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

    localStorage.setItem("theme", colortheme);
  }, [colortheme, isDarkMode]);

  useEffect(() => {
    if (language === "system") {
      localStorage.removeItem("lang");
    } else if (language === "de") {
      localStorage.setItem("lang", "de");
    } else if (language === "en") {
      localStorage.setItem("lang", "en");
    } else {
      console.error(`Invalid language: ${language}`);
      return;
    }
  }, [language]);

  return (
    <Sidebar
      visible={settingsSidebarVisible}
      onHide={() => setSettingsSidebarVisible(false)}
      position="top"
    >
      {/* TODO Settings */}
      <div className="flex w-full justify-center items-center pt-2 gap-2">
        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Color Mode</div>
          <SelectButton
            value={colortheme}
            onChange={(e) => {
              setColortheme(e.value);
            }}
            itemTemplate={colorModeTemplate}
            optionLabel="Color Theme"
            options={colortheme_items}
            unselectable={false}
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-500">Language</div>
          <Dropdown
            value={language}
            options={[
              { label: "System", value: "system" },
              { label: "Deutsch", value: "de" },
              { label: "English", value: "en" },
            ]}
            onChange={(e) => {
              setLanguage(e.value);
              window.location.reload();
            }}
          />
        </div>
      </div>
    </Sidebar>
  );
}
