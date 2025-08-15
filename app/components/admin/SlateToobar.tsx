// components/admin/SlateToolbar.tsx
'use client'

import React from 'react'
import { Editor } from 'slate'
import {
  toggleMark,
  isMarkActive,
  toggleBlock,
  isBlockActive,
} from '@/utils/slate'

interface ButtonProps {
  onMouseDown: (e: React.MouseEvent) => void
  active: boolean
  children: React.ReactNode
}

const ToolbarButton = ({ onMouseDown, active, children }: ButtonProps) => (
  <button
    onMouseDown={e => { e.preventDefault(); onMouseDown(e) }}
    className={`px-2 py-1 font-bold rounded ${active ? 'bg-gray-300' : 'bg-white'}`}
  >
    {children}
  </button>
)

export function SlateToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex space-x-1 mb-2">
      <ToolbarButton
        onMouseDown={() => toggleMark(editor, 'bold')}
        active={isMarkActive(editor, 'bold')}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        onMouseDown={() => toggleMark(editor, 'italic')}
        active={isMarkActive(editor, 'italic')}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        onMouseDown={() => toggleBlock(editor, 'bulleted-list')}
        active={isBlockActive(editor, 'bulleted-list')}
      >
        L
      </ToolbarButton>
      <ToolbarButton
        onMouseDown={() => toggleBlock(editor, 'numbered-list')}
        active={isBlockActive(editor, 'numbered-list')}
      >
        N
      </ToolbarButton>
    </div>
  )
}