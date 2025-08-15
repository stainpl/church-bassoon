'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Type definitions
type Member = {
  id: string
  fullName: string
  email: string
  gender: 'MALE' | 'FEMALE'
  joinedAt: string
}

type Stats = {
  total: number
  male: number
  female: number
}

export function MembersSection() {
  const router = useRouter()

  // State
  const [stats, setStats] = useState<Stats>({ total: 0, male: 0, female: 0 })
  const [members, setMembers] = useState<Member[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalMember, setModalMember] = useState<Member | null>(null)
  const perPage = 20

  // Fetch stats + first page
  useEffect(() => {
    fetch('/api/admin/members/stats')
      .then(r => r.json())
      .then(setStats)

    fetch(`/api/admin/members?limit=${perPage}&page=${page}`)
      .then(r => r.json())
      .then(data => setMembers(data))
  }, [page])

  // Search
  const doSearch = () => {
    fetch(`/api/admin/members?search=${encodeURIComponent(search)}`)
      .then(r => r.json())
      .then(data => setMembers(data))
  }

  return (
    <section className="space-y-8">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm font-medium">Total Members</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm font-medium">Male Members</p>
          <p className="text-2xl font-bold">{stats.male}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm font-medium">Female Members</p>
          <p className="text-2xl font-bold">{stats.female}</p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard/members/new')}
          className="bg-blue-500 text-white p-4 rounded shadow hover:bg-blue-600 transition"
        >
          + Add New Member
        </button>
      </div>

      {/* 2. Search / Filter */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded"
          placeholder="Search members…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && doSearch()}
        />
        <button
          onClick={doSearch}
          className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* 3. Recent Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(m => (
          <div
            key={m.id}
            className="bg-white p-4 rounded shadow hover:shadow-md cursor-pointer"
            onClick={() => setModalMember(m)}
          >
            <h3 className="font-semibold">{m.fullName}</h3>
            <p className="text-sm text-gray-500">{m.email}</p>
            <p className="text-sm mt-1">{m.gender}</p>
          </div>
        ))}
      </div>

      {/* 4. Pagination */}
      {/* 4. Pagination */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page{page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* 5. Edit/Delete Modal */}
      {modalMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-semibold">Edit Member</h2>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={modalMember.fullName}
              onChange={e =>
                setModalMember(m => m && { ...m, fullName: e.target.value })
              }
            />
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={modalMember.email}
              onChange={e =>
                setModalMember(m => m && { ...m, email: e.target.value })
              }
            />
            {/* Add other fields (gender, dob…) as needed */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalMember(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  fetch(`/api/admin/members/${modalMember.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(modalMember),
                  }).then(() => {
                    setModalMember(null)
                    // refresh list
                    doSearch()
                  })
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this member?')) {
                    fetch(`/api/admin/members/${modalMember.id}`, { method: 'DELETE' })
                      .then(() => {
                        setModalMember(null)
                        setMembers(ms => ms.filter(x => x.id !== modalMember.id))
                      })
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
