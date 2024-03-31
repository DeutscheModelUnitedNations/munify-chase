import React, { useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  faGripDots,
  faTriangleExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { Tooltip } from "primereact/tooltip";
import SlateClauseEditor from "./slate_clause_editor";
import { Descendant } from "slate";

export enum ResDelimiter {
  COMMA = ",",
  SEMICOLON = ";",
  PERIOD = ".",
}

export enum ClauseTypeEnum {
  OPERATIVE = "operative",
  PREAMBLE = "preamble",
}

export interface ClauseType {
  id: string;
  number: number;
  content: Descendant[];
  type: ClauseTypeEnum;
  validOperator?: boolean;
}

export default function Clause({
  clause,
  isLastClause = false,
  onClickFunction,
}: {
  clause: ClauseType;
  isLastClause?: boolean;
  onClickFunction: () => void;
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
          "py-2 px-4 rounded-md hover:bg-primary-950 active:z-50 transition-colors duration-200 relative min-h-10"
        }
        ref={setNodeRef}
        style={style}
        {...attributes}
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        onClick={() => onClickFunction()}
        onKeyDown={() => onClickFunction()}
      >
        <div className="flex gap-2 justify-start items-start">
          <Tooltip
            target=".invalid-operator-warning"
            pt={{ text: { className: "!shadow-none !bg-orange-500" } }}
          />
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
            } cursor-grab active:cursor-grabbing hover:text-primary-500 hover:scale-125 transition-all duration-300 px-2 z-40`}
          >
            <FontAwesomeIcon icon={faGripDots} className="text-sm" />
          </div>
          <div className="indent-10">
            <SlateClauseEditor
              content={clause.content}
              renderForResolution
              clauseNumber={
                clause.type === ClauseTypeEnum.OPERATIVE
                  ? clause.number
                  : undefined
              }
              delimiter={
                clause.type === ClauseTypeEnum.OPERATIVE
                  ? isLastClause
                    ? ResDelimiter.PERIOD
                    : ResDelimiter.SEMICOLON
                  : ResDelimiter.COMMA
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
