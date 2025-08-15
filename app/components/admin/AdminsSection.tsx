// components/admin/AdminsSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  ArrowPathIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useToast } from '@/lib/toast'

type Admin = {
  id: string
  name: string
  email: string
  joinedOn: string
}

type Stats = { totalAdmins: number }

export function AdminsSection() {
  const router = useRouter()
  const toast = useToast()

  const [stats, setStats] = useState<Stats>({ totalAdmins: 0 })
  const [admins, setAdmins] = useState<Admin[]>([])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Admin | null>(null)
  const perPage = 20

  // Fetch stats & admin list
  useEffect(() => {
    fetch('/api/admins/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => toast('Failed to load stats', { type: 'error' }))

    fetch(`/api/admins?limit=${perPage}&page=${page}`)
      .then(res => res.json())
      .then(setAdmins)
      .catch(() => toast('Failed to load admins', { type: 'error' }))
  }, [page, toast])

  const lastPage = Math.ceil(stats.totalAdmins / perPage)

  // Actions
  const handleInvite = () => {
    router.push('/admin/dashboard/admins/invite')
  }

  const handleEdit = (admin: Admin) => {
    router.push(`/admin/dashboard/admins/${admin.id}/edit`)
  }

  const handleReset = async (admin: Admin) => {
    if (!confirm(`Send password reset to ${admin.email}?`)) return
    try {
      const res = await fetch(`/api/admins/${admin.id}/reset`, { method: 'POST' })
      if (!res.ok) throw new Error()
      toast('Reset link sent', { type: 'success' })
    } catch {
      toast('Failed to send reset', { type: 'error' })
    }
  }

  const handleDelete = async (admin: Admin) => {
    if (!confirm(`Delete admin ${admin.name}?`)) return
    try {
      const res = await fetch(`/api/admins/${admin.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast('Admin deleted', { type: 'success' })
      setPage(1)
    } catch {
      toast('Failed to delete admin', { type: 'error' })
    }
  }

  return (
    <section className="space-y-8">
      {/* Stats + Invite */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow flex items-center">
          <UserGroupIcon className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Total Admins</p>
            <p className="text-2xl font-bold">{stats.totalAdmins}</p>
          </div>
        </div>
        <button
          onClick={handleInvite}
          className="bg-green-500 text-white p-6 rounded shadow hover:bg-green-600 transition flex items-center justify-center"
        >
          <PlusIcon className="w-6 h-6 mr-2" />
          Invite New Admin
        </button>
      </div>

      {/* Admins Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              {['Name', 'Email', 'Joined On', 'Actions'].map(h => (
                <th key={h} className="px-4 py-2 text-sm font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{a.name}</td>
                <td className="px-4 py-3">{a.email}</td>
                <td className="px-4 py-3">{new Date(a.joinedOn).toLocaleDateString()}</td>
                <td className="px-4 py-3 space-x-2">
                  <button onClick={() => handleEdit(a)}>
                    <PencilIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </button>
                  <button onClick={() => handleReset(a)}>
                    <ArrowPathIcon className="w-5 h-5 text-yellow-500 hover:text-yellow-700" />
                  </button>
                  <button onClick={() => handleDelete(a)}>
                    <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === lastPage}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  )
}
