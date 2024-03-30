// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export enum Type {
  PARAGRAPH = 'paragraph',
  ORDERED_LIST = 'ordered-list',
  UNORDERED_LIST = 'unordered-list',
  LIST_ITEM = 'list-item',
  LIST_ITEM_TEXT = 'list-item-text',
}

export type ResEditor = BaseEditor & ReactEditor

export type CustomElement = {
  type: Type
  children: CustomText[]

}

export type FormattedText = { text: string; operator?: true }

export type CustomText = FormattedText

declare module 'slate' {
  interface CustomTypes {
    Editor: ResEditor;
    // @ts-ignore I don't know what the problem is here
    Element: CustomElement;
    // @ts-ignore I don't know what the problem is here
    Text: CustomText;
  }
}