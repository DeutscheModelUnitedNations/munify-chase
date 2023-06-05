"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NavbarButton({
  active,
  icon,
  link = "",
  onClick = null,
}) {
  const [wrapperStyle, setWrapperStyle] = useState("");
  const defaultWrapperStyle =
    "flex-1 rounded-md flex flex-col justify-center items-center";

  useEffect(() => {
    if (active) {
      setWrapperStyle(`${defaultWrapperStyle} bg-dmunlight text-white`);
    } else {
      setWrapperStyle(
        `${defaultWrapperStyle} bg-dmun text-dmunlight hover:bg-dmunlight hover:text-white transition cursor-pointer`,
      );
    }
  }, [active]);

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
