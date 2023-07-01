"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface NavbarButtonProps {
  icon: FontAwesomeIconProps["icon"];
  link?: string;
  onClick?: () => void;
}

/**
 * This Component is used in the Navbar. It displays a button with an icon.
 * It is used to navigate to other pages.
 */

export default function NavbarButton({
  icon,
  link = "",
  onClick,
}: NavbarButtonProps) {
  const pathname = usePathname();

  const [wrapperStyle, setWrapperStyle] = useState("");
  const defaultWrapperStyle =
    "flex-1 rounded-md flex flex-col justify-center items-center";

  useEffect(() => {
    // if the link starts with the current page route, set the button to active
    if (link.startsWith(pathname)) {
      setWrapperStyle(`${defaultWrapperStyle} bg-primary-800 text-white`);
    } else {
      setWrapperStyle(
        `${defaultWrapperStyle} bg-primary text-primary-800 hover:bg-primary-800 hover:text-white transition cursor-pointer`
      );
    }
  }, [pathname]);

  return link === "" && onClick !== null ? (
    <div className={wrapperStyle}>
      <FontAwesomeIcon icon={icon} className=" text-xl m-3" onClick={onClick} />
    </div>
  ) : (
    <Link href={link} className="w-full">
      <div className={wrapperStyle}>
        <FontAwesomeIcon icon={icon} className=" text-xl m-3" />
      </div>
    </Link>
  );
}
