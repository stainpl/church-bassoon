// components/admin/NewsletterSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapIcon, UserPlusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/lib/toast'

type Newsletter = {
  id: string
  title: string
  publishedBy: string
  publishedAt: string
}

type Stats = {
  totalNewsletters: number
  totalSubscribers: number
}

export function NewsletterSection() {
  const router = useRouter()
  const toast = useToast()

  const [stats, setStats] = useState<Stats>({ totalNewsletters: 0, totalSubscribers: 0 })
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Newsletter | null>(null)
  const perPage = 20

  // Fetch stats and newsletters
  useEffect(() => {
    fetch('/api/admin/newsletters/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load stats')
        return res.json()
      })
      .then(setStats)
      .catch(err => toast(err.message, { type: 'error' }))

    fetch(`/api/admin/newsletters?limit=${perPage}&page=${page}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load newsletters')
        return res.json()
      })
      .then(setNewsletters)
      .catch(err => toast(err.message, { type: 'error' }))
  }, [page, toast])

  const lastPage = Math.ceil(stats.totalNewsletters / perPage)

  const handleDelete = async (nl: Newsletter) => {
    if (!confirm('Delete this newsletter?')) return
    try {
      const res = await fetch(`/api/admin/newsletters/${nl.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast('Newsletter deleted', { type: 'success' })
      setSelected(null)
      setPage(1)
    } catch (err: any) {
      toast(err.message || 'Failed to delete newsletter', { type: 'error' })
    }
  }

  return (
    <section className="space-y-8">
      {/* Stats + Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow flex items-center">
          <MapIcon className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Total Newsletters</p>
            <p className="text-2xl font-bold">{stats.totalNewsletters}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow flex items-center cursor-pointer hover:bg-gray-50 transition"
             onClick={() => router.push('/admin/dashboard/newsletters/new')}
        >
          <PlusIcon className="w-8 h-8 text-green-500 mr-4" />
          <p className="text-sm font-medium">Add Newsletter</p>
        </div>

        <div className="bg-white p-6 rounded shadow flex items-center">
          <UserPlusIcon className="w-8 h-8 text-purple-500 mr-4 cursor-pointer hover:text-purple-600 transition"
                        onClick={() => router.push('/admin/dashboard/subscribers/new')} />
          <div>
            <p className="text-sm font-medium">Total Subscribers</p>
            <p className="text-2xl font-bold">{stats.totalSubscribers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow flex items-center cursor-pointer hover:bg-gray-50 transition"
             onClick={() => router.push('/admin/dashboard/subscribers/new')}
        >
          <PlusIcon className="w-8 h-8 text-indigo-500 mr-4" />
          <p className="text-sm font-medium">Add Subscriber</p>
        </div>
      </div>

      {/* Newsletters Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              {['Title', 'Published By', 'Published At'].map(h => (
                <th key={h} className="px-4 py-2 text-sm font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {newsletters.map(nl => (
              <tr key={nl.id} className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelected(nl)}>
                <td className="px-4 py-3">{nl.title}</td>
                <td className="px-4 py-3">{nl.publishedBy}</td>
                <td className="px-4 py-3">{new Date(nl.publishedAt).toLocaleDateString()}</td>
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

      {/* Delete Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Delete Newsletter</h2>
            <p>Are you sure you want to delete “{selected.title}”?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >Cancel</button>
              <button
                onClick={() => handleDelete(selected)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
