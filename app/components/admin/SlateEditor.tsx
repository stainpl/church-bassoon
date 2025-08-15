// components/admin/SlateEditor.tsx
'use client'

import React, { useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { createEditor, Descendant } from 'slate'
import { SlateToolbar } from '../../components/admin/SlateToobar'

// Now Descendant already knows about CustomElement & CustomText
interface SlateEditorProps {
  value: Descendant[]
  onChange: (newValue: Descendant[]) => void
}

export default function SlateEditor({ value, onChange }: SlateEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), [])

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange}>
      <SlateToolbar editor={editor} />
      <Editable
        className="bg-white p-2 rounded border min-h-[150px]"
        renderLeaf={({ attributes, children, leaf }) => {
          let el = children
          if (leaf.bold) {
            el = <strong>{el}</strong>
          }
          if (leaf.italic) {
            el = <em>{el}</em>
          }
          return <span {...attributes}>{el}</span>
        }}
        renderElement={({ attributes, children, element }) => {
          switch (element.type) {
            case 'bulleted-list':
              return <ul {...attributes}>{children}</ul>
            case 'list-item':
              return <li {...attributes}>{children}</li>
            default:
              return <p {...attributes}>{children}</p>
          }
        }}
      />
    </Slate>
  )
}