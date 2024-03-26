import { ClauseType, ResDelimiter } from '@/components/resEditor/clause'
import operators from '../data/operators.json'

export function addDelimiterToClause(delimiter: ResDelimiter, clause: ClauseType, isNested = false, isLastPart = false) {

  if (typeof clause.content === 'string') {
    return {
      ...clause,
      content: (!isNested || isLastPart) ? clause.content + delimiter : clause.content
    }
  }

  return {
    ...clause,
    content: clause.content.map((part, index) => {
      if (typeof part === 'string' && index === clause.content.length - 1) {
        return part + delimiter
      }

      if (typeof part === 'string') {
        return part
      }

      return addDelimiterToClause(delimiter, part, true, index === clause.content.length - 1)
    })
  }
}

function stringifyClause(clause: ClauseType): string {
  if (typeof clause.content === 'string') {
    return clause.content
  }

  return clause.content.map(part => {
    if (typeof part === 'string') {
      return part
    }

    return stringifyClause(part)
  }).join('')
}

export function checkValidOperator(clause: ClauseType, section: "operativeClauses" | "preambleClauses") {
const stringifiedClause = stringifyClause(clause)
const regex = /<([^>]+)>/g;

const matches = [...stringifiedClause.matchAll(regex)].map(match => match[1]);

  if (!matches || matches?.length === 0) {
    return {
      ...clause,
      validOperator: false
    }
  }

  const validOperators = operators[section]

  for (const operator of validOperators) {
    if (operator.split("|").every((part, index) => part === matches[index])) {
      return {
        ...clause,
        validOperator: true
      }
    }

  }


  return {
    ...clause,
    validOperator: false
  }
}
