// components/PublicNavBar.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/authProvider'
import { NavBar } from './NavBar'

export function PublicNavBar() {
  const { user } = useAuth()
  const path = usePathname()

  // If logged in, or on any /admin path, hide the public nav entirely
  if (user || path?.startsWith('/admin')) {
    return null
  }

  return <NavBar />
}
