// app/loading.tsx
'use client'
import React from 'react'
import { Loader } from '@/app/components/Loader'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/75">
      <Loader size={48} strokeWidth={6} />
    </div>
  )
}