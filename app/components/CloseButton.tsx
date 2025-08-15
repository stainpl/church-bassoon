// components/CloseButton.tsx
'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { Loader } from './Loader'

interface CloseButtonProps {
  onClick?: () => void
}

export const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClose = async () => {
    setLoading(true)
    try {
      if (onClick) {
        onClick()
      } else {
        // default behavior
        router.push('/')
      }
    } finally {
      // Keep loading state for a brief moment to show spinner
      setTimeout(() => setLoading(false), 300)
    }
  }

  return (
    <button
      onClick={handleClose}
      disabled={loading}
      className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-700 disabled:opacity-50"
    >
      {loading 
        ? <Loader size={20} strokeWidth={3} /> 
        : <X size={20} />}
    </button>
  )
}