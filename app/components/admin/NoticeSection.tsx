// components/admin/NoticeSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import {
  BellIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useToast } from '@/lib/toast'
import { NoticeBar } from '../../components/NoticeBar'

type ActiveNotice = {
  id: string
  text: string
  addedBy: string
}

type RemovedNotice = {
  id: string
  text: string
  addedBy: string
  removedBy: string
  removedAt: string | null
}

type Tab = 'active' | 'removed'

export function NoticeSection() {
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('active')

  // Active notice state
  const [activeNotice, setActiveNotice] = useState<ActiveNotice | null>(null)
  const [input, setInput] = useState('')
  const [editing, setEditing] = useState<ActiveNotice | null>(null)

  // Removed notices state
  const [removed, setRemoved] = useState<RemovedNotice[]>([])
  const [page, setPage] = useState(1)
  const perPage = 20

  // Fetch active notice
  useEffect(() => {
    if (tab !== 'active') return
    fetch('/api/admin/notices/active')
      .then((r) => r.json())
      .then((d) => setActiveNotice(d.notice))
      .catch(() => toast('Failed to load active notice', { type: 'error' }))
  }, [tab, toast])

  // Fetch removed notices
  useEffect(() => {
    if (tab !== 'removed') return
    fetch(`/api/admin/notices/removed?limit=${perPage}&page=${page}`)
      .then((r) => r.json())
      .then(setRemoved)
      .catch(() => toast('Failed to load removed notices', { type: 'error' }))
  }, [tab, page, toast])

  // Create or update notice
  const handleSave = async () => {
    if (!input.trim()) {
      toast('Notice cannot be empty', { type: 'error' })
      return
    }
    try {
      const payload = editing
        ? { id: editing.id, text: input.trim() }
        : { text: input.trim() }
      const res = await fetch('/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast(editing ? 'Notice updated' : 'Notice published', { type: 'success' })
      setEditing(null)
      setInput('')
      setTab('active')
      const { notice } = await fetch('/api/admin/notices/active').then((r) => r.json())
      setActiveNotice(notice)
    } catch {
      toast('Error saving notice', { type: 'error' })
    }
  }

  // Soft-delete active
  const handleDeleteActive = async () => {
    if (!activeNotice || !confirm('Delete this notice?')) return
    await fetch(`/api/admin/notices/${activeNotice.id}`, { method: 'DELETE' })
    toast('Notice deleted', { type: 'success' })
    setActiveNotice(null)
  }

  // Purge removed
  const handlePurge = async (id: string) => {
    if (!confirm('Permanently delete this notice?')) return
    await fetch(`/api/admin/notices/${id}`, { method: 'DELETE' })
    toast('Notice purged', { type: 'success' })
    setRemoved((r) => r.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6 bg-gray-300">
      {/* Tabs */}
      <div className="flex space-x-4">
        {(['active', 'removed'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t)
              setPage(1)
              setEditing(null)
              setInput('')
            }}
            className={`px-4 py-2 rounded ${
              tab === t ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            {t === 'active' ? 'Active Notice' : 'Removed Notices'}
          </button>
        ))}
      </div>

      {/* Active Tab */}
      {tab === 'active' && (
        <div className="space-y-4">
          {/* Add / Edit Input */}
          <div className="flex items-center bg-white p-4 rounded shadow">
            <BellIcon className="w-8 h-8 text-indigo-500 mr-3" />
            <input
              type="text"
              placeholder="Enter notice text..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border rounded px-3 py-2 mr-3"
            />
            {editing && (
              <button
                onClick={() => {
                  setEditing(null)
                  setInput('')
                }}
                className="text-gray-500 mr-3"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              {editing ? 'Update' : 'Publish'}
            </button>
          </div>

          {/* Notice Bar */}
          {activeNotice ? (
            <div className="relative">
              <NoticeBar text={activeNotice.text} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => {
                    setEditing(activeNotice)
                    setInput(activeNotice.text)
                  }}
                  className="p-1 bg-white rounded shadow hover:bg-gray-50"
                >
                  <PencilIcon className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={handleDeleteActive}
                  className="p-1 bg-white rounded shadow hover:bg-gray-50"
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">No active notice set.</div>
          )}
        </div>
      )}

      {/* Removed Tab */}
      {tab === 'removed' && (
        <>
          <div className="bg-white rounded shadow overflow-x-auto bg-gray-350">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Text</th>
                  <th className="px-4 py-2">Added By</th>
                  <th className="px-4 py-2">Removed By</th>
                  <th className="px-4 py-2">Removed At</th>
                  <th className="px-4 py-2">Purge</th>
                </tr>
              </thead>
              <tbody>
                {removed.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{n.text}</td>
                    <td className="px-4 py-2">{n.addedBy}</td>
                    <td className="px-4 py-2">{n.removedBy}</td>
                    <td className="px-4 py-2">
                      {n.removedAt
                        ? new Date(n.removedAt).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handlePurge(n.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <TrashIcon className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              ‹ Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next ›
            </button>
          </div>
        </>
      )}
    </div>
  )
}
