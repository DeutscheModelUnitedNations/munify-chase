import React from "react";
import { Button as PrimeReactButton } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  label?: string;
  faIcon?: IconProp;
  faIconClassName?: string;
  keyboardShortcut?: string;
  [key: string]: unknown;
}

/**
 * This Component is a wrapper for the PrimeReact Button Component.
 * It allows easy usage of the FontAwesomeIcon Component as an icon for the Button.
 * The padding between the icon and the label is automatically set wether the label is present or not.
 * @param label The label of the Button
 * @param faIcon The FontAwesomeIcon to be used as an icon for the Button
 * @param faIconClassName The className of the FontAwesomeIcon
 * @param keyboardShortcut The keyboard shortcut to be displayed on the Button
 * @param rest The rest of the props that are passed to the PrimeReact Button Component
 * @returns A Button Component
 */

export default function Button({
  label,
  faIcon,
  faIconClassName,
  keyboardShortcut,
  ...rest
}: ButtonProps) {
  return (
    <PrimeReactButton
      {...rest}
      icon={
        faIcon && (
          <FontAwesomeIcon
            icon={faIcon}
            className={`${label && "mr-3"} + ${faIconClassName}`}
          />
        )
      }
    >
      <div className="flex flex-row items-center justify-center w-full">
        <span className="font-bold">{label}</span>
        {keyboardShortcut && (
          <span className="text-xs ml-4 opacity-30 text-white bg-black px-2 py-1 rounded-md">{keyboardShortcut}</span>
        )}
      </div>
    </PrimeReactButton>
  );
}
