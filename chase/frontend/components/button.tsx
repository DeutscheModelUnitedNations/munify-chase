import React from "react";
import { Button as PrimeReactButton } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps {
  label?: string;
  faIcon?: IconDefinition;
  [key: string]: any;
}

/**
 * This Component is a wrapper for the PrimeReact Button Component.
 * It allows easy usage of the FontAwesomeIcon Component as an icon for the Button.
 * The padding between the icon and the label is automatically set wether the label is present or not.
 * @param label The label of the Button
 * @param faIcon The FontAwesomeIcon to be used as an icon for the Button
 * @param rest The rest of the props that are passed to the PrimeReact Button Component
 * @returns A Button Component
 */

export default function Button({ label, faIcon, ...rest }: ButtonProps) {
  return (
    <PrimeReactButton
      {...rest}
      label={label}
      icon={
        faIcon && <FontAwesomeIcon icon={faIcon} className={label && "mr-3"} />
      }
    />
  );
}
