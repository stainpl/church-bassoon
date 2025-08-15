// utils/slate.ts
import { Editor, Transforms, Element as SlateElement, Text } from 'slate'
import type {
  BulletedListElement,
  NumberedListElement,
  ListItemElement,
} from 'slate'

// ——— MARKS ———————————————————————————————————————————————————

// returns true if the `format` (e.g. 'bold' or 'italic') is currently on the selection
export const isMarkActive = (editor: Editor, format: string): boolean => {
  const marks = Editor.marks(editor)
  // @ts-ignore
  return marks ? marks[format] === true : false
}

// toggles the given mark on/off
export const toggleMark = (editor: Editor, format: string): void => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}


// ——— BLOCKS ——————————————————————————————————————————————————

// the two list wrappers you set up in your slate.d.ts
const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const
export type BlockType = 'paragraph' | typeof LIST_TYPES[number] | 'list-item'

// returns true if the block at selection matches `format`
export const isBlockActive = (editor: Editor, format: BlockType): boolean => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      n.type === format,
  })
  return !!match
}

// toggles between normal paragraph, list-item, and wrapping with a list container
export const toggleBlock = (editor: Editor, format: BlockType): void => {
  const isActive = isBlockActive(editor, format)
  const isList = format === 'numbered-list' || format === 'bulleted-list'

  // 1) unwrap any existing lists
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      LIST_TYPES.includes(n.type),
    split: true,
  })

  // 2) decide which type to apply
  const newType: BlockType = isActive
    ? 'paragraph'
    : isList
      ? 'list-item'
      : format

  Transforms.setNodes(editor, { type: newType })

  // 3) if we just turned on a list container, wrap it
  if (!isActive && isList) {
    const wrapper: BulletedListElement | NumberedListElement =
      format === 'numbered-list'
        ? { type: 'numbered-list', children: [] }
        : { type: 'bulleted-list', children: [] }

    Transforms.wrapNodes(editor, wrapper)
  }
}