// slate.d.ts
import { BaseEditor, BaseElement, BaseText } from 'slate'
import { ReactEditor } from 'slate-react'

declare module 'slate' {
  interface CustomText extends BaseText {
    bold?: boolean
    italic?: boolean
  }

  interface ParagraphElement extends BaseElement {
    type: 'paragraph'
    children: CustomText[]
  }
  interface BulletedListElement extends BaseElement {
    type: 'bulleted-list'
    children: ListItemElement[]
  }
  interface NumberedListElement extends BaseElement {
    type: 'numbered-list'
    children: ListItemElement[]
  }
  interface ListItemElement extends BaseElement {
    type: 'list-item'
    children: CustomText[]
  }

  type CustomElement =
    | ParagraphElement
    | BulletedListElement
    | NumberedListElement
    | ListItemElement

  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}