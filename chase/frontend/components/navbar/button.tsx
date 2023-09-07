"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { IconDefinition } from "@fortawesome/pro-solid-svg-icons";

interface NavbarButtonProps {
  icon: IconDefinition;
  title: string;
  link?: string;
  onClick?: () => void;
  newWindow?: boolean;
}

/**
 * This Component is used in the Navbar. It displays a button with an icon.
 * It is used to navigate to other pages.
 */

export default function NavbarButton({
  icon,
  title,
  link = "",
  onClick,
  newWindow = false,
}: NavbarButtonProps) {
  const pathname = usePathname();

  const [wrapperStyle, setWrapperStyle] = useState("");
  const defaultWrapperStyle =
    "flex-1 rounded-md flex flex-col justify-center items-center";

  useEffect(() => {
    // if the link starts with the current page route, set the button to active
    if (link.startsWith(pathname)) {
      setWrapperStyle(
        `${defaultWrapperStyle} bg-primary-800 dark:bg-primary-300 text-white dark:text-primary-100`,
      );
    } else {
      setWrapperStyle(
        `${defaultWrapperStyle} bg-primary text-primary-800 dark:text-primary-300 hover:bg-primary-800 dark:hover:bg-primary-300 hover:text-white dark:hover:text-primary-100 transition cursor-pointer`,
      );
    }
  }, [pathname]);

  const openLinkInNewWindow = () => {
    window.open(link, "_blank", "noopener,noreferrer,menubar=no,toolbar=no");
  };

  return (link === "" && onClick !== null) || newWindow ? (
    <div className={wrapperStyle} title={title}>
      <FontAwesomeIcon
        icon={icon}
        className=" text-xl m-3"
        onClick={newWindow ? openLinkInNewWindow : onClick}
      />
    </div>
  ) : (
    <Link href={link} className="w-full" title={title}>
      <div className={wrapperStyle}>
        <FontAwesomeIcon icon={icon} className=" text-xl m-3" />
      </div>
    </Link>
  );
}
