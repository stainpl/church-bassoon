// app/admin/dashboard/layout.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authProvider'
import { LoaderCentered } from '../../components/LoaderCentered'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()


  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/admin/login')
    }
  }, [loading, user, router])

  if (loading) return < LoaderCentered/>

  return  <>{children}</>
}
