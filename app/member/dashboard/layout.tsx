'use client'

import React, { useEffect } from 'react'
import { useRouter }         from 'next/navigation'
import { useAuth }           from '@/lib/authProvider'
import { LoaderCentered } from '../../components/LoaderCentered'

export default function MemberDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'MEMBER')) {
      router.replace('/member/login')
    }
  }, [loading, user, router])

  if (loading || !user) {
    return <LoaderCentered />
  }

  return <div className="flex h-screen">{children}</div>
}
