import { ClauseType, ClauseTypeEnum } from "@/components/resEditor/clause";
import operators from "../data/operators.json";
import { Descendant } from "slate";

export enum OperatorValidity {
  VALID = 1,
  INVALID = -1,
  NONE = 0,
}

/**
 * Checks for operators in a clause and validates them against a given section.
 * @param clause - The array of Descendant objects representing the clause.
 * @param section - The section to validate the operators against ("operative" or "preamble").
 * @returns The validity of the operators in the clause as an OperatorValidity enum (VALID, INVALID, or NONE).
 */
export function checkForOperatorsAndValidate(
  clause: Descendant[],
  section: ClauseTypeEnum,
) {

  const operatorInClause: string[] = [];

  /**
   * Recursively finds operators in a Descendant node.
   * @param node - The Descendant node to search for operators.
   */
  const findOperator = (node: Descendant) => {
    if ("text" in node) {
      if (node.operator) {
        operatorInClause.push(node.text.trim());
      }
    } else {
      node.children.forEach(findOperator);
    }
  }

  clause.forEach(findOperator);

  console.log(operatorInClause);

  const validOperators = operators[section.toString()];
  if (!validOperators) {
    return operatorInClause.length === 0 ? OperatorValidity.NONE : OperatorValidity.INVALID;
  }

  for (const operator of validOperators) {
    if (operator.split("|").every((part, index) => part === operatorInClause[index])) {
      return OperatorValidity.VALID;
    }
  }

  return operatorInClause.length === 0 ? OperatorValidity.NONE : OperatorValidity.INVALID;
}


/**
 * Checks if a clause has a valid operator.
 * 
 * @param clause - The array of Descendant objects representing the clause.
 * @param section - The section to validate the operators against. Can be either "operative" or "preamble".
 * @returns Returns true if the clause has a valid operator, otherwise false.
 */
export function checkHasValidOperator(
  clause: Descendant[],
  section: ClauseTypeEnum,
) {
  return checkForOperatorsAndValidate(clause, section) === OperatorValidity.VALID;
}

/**
 * Checks if a clause has a valid operator and adds a flag indicating its validity.
 * 
 * @param clause - The clause to check and add the flag to.
 * @param section - The section to validate the operators against. Can be either "operative" or "preamble".
 * @returns Returns the clause with the added validOperator flag.
 */
export function checkValidOperatorAndAddFlag(
  clause: ClauseType,
  section: ClauseTypeEnum,
) {
  return {
    ...clause,
    validOperator: checkHasValidOperator(clause.content, section),
  };
}

