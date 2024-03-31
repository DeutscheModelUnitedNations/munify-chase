// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum Type {
  PARAGRAPH = 'paragraph',
  ORDERED_LIST = 'ordered-list',
  LIST_ITEM = 'list-item',
  LIST_ITEM_TEXT = 'list-item-text',
}

export type ResEditor = BaseEditor & ReactEditor

export type CustomElement = {
  type: Type
  children: CustomText[]
}

export type FormattedText = { text: string; operator?: boolean; clauseNumber?: boolean; delimiter?: boolean }

export type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: ResEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}