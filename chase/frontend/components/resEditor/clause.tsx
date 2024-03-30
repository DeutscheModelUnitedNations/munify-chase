import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { useBackend } from "@/contexts/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  faGripDots,
  faTriangleExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import romanize from "@/misc/to_roman_numerals";
import { Tooltip } from "primereact/tooltip";

export enum ResDelimiter {
  COMMA = ",",
  SEMICOLON = ";",
  PERIOD = ".",
}

export interface ClauseType {
  id: string;
  number: number;
  content: string | (string | ClauseType)[];
  validOperator?: boolean;
}

export default function Clause({
  clause,
  noNumbering = false,
  onClickFunction = undefined,
}: {
  clause: ClauseType;
  noNumbering?: boolean;
  onClickFunction?: () => void;
}) {
  const { LL } = useI18nContext();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id: clause.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const [hovering, setHovering] = useState(false);

  return (
    <>
      <div
        className={
          "py-2 px-4 rounded-md hover:bg-primary-950 active:z-50 transition-colors duration-200 relative"
        }
        ref={setNodeRef}
        style={style}
        {...attributes}
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
      >
        <div className="flex gap-2 justify-start items-start">
          <Tooltip target=".invalid-operator-warning" pt={{text: { className: "!shadow-none !bg-orange-500" }}} />
          {!clause.validOperator && (
            <div
              className="absolute -left-8 invalid-operator-warning"
              data-pr-tooltip={LL.resolutionEditor.editor.INVALID_OPERATOR()}
              data-pr-position="left"
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-2xl text-orange-500"
              />
            </div>
          )}
          <div
            {...listeners}
            ref={setActivatorNodeRef}
            className={`absolute ${
              hovering ? "opacity-100" : "opacity-0"
            } cursor-grab active:cursor-grabbing hover:text-primary-500 hover:scale-125 transition-all duration-300 px-2`}
          >
            <FontAwesomeIcon icon={faGripDots} className="text-sm" />
          </div>
          <div className="indent-10">
            <RenderClause clause={clause} noNumber={noNumbering} layer={0} />
          </div>
        </div>
      </div>
    </>
  );
}

function RenderClause({
  clause,
  noNumber = false,
  layer = 0,
}: {
  clause: ClauseType;
  noNumber?: boolean;
  layer: number;
}) {
  function italicizesOperators(text: string) {
    // The Operators are wrapped in < and >
    // Split the text using a regex that captures the content inside the brackets without including the brackets themselves
    return text.split(/<([^>]+)>/).map((part, index) => {
      // Every odd part is the one that was within brackets, so we italicize it
      if (index % 2 === 1) {
        return <span className="italic">{part}</span>;
      }
      // Even parts are outside of brackets and are returned as plain text
      return part;
    });
  }

  function addNumber(number: number, layer = 0, text?: React.ReactNode) {
    let num = "";
    if (layer === 0) {
      num = number.toString();
    }

    if (layer === 1) {
      num = romanize(number);
    }

    if (layer >= 2) {
      num = String.fromCharCode(97 + number).repeat(layer - 1);
    }

    return (
      <>
        <span className="font-bold mr-4 lining-nums">{num}.</span>
        {text}
      </>
    );
  }

  if (typeof clause.content === "string") {
    const text = italicizesOperators(clause.content);
    const res = !noNumber ? addNumber(clause.number, layer, text) : text;
    return <span>{res}</span>;
  }

  return (
    <>
      {clause.content.map((part, index) => {
        if (typeof part === "string") {
          const text = italicizesOperators(part);
          const res =
            !noNumber && index === 0
              ? addNumber(clause.number, layer, text)
              : text;
          return <p>{res}</p>;
        }
        return (
          <p
            style={{
              textIndent: `${(layer + 1) * 2 + 2.5}rem`,
            }}
          >
            <RenderClause clause={part} layer={layer + 1} />
          </p>
        );
      })}
    </>
  );
}
