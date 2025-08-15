// components/admin/PaymentsSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CurrencyDollarIcon,
  PlusIcon,
  GiftIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'

type Payment = {
  id: string
  date: string
  reference: string
  initiatedBy: string
  amount: number
  status: string
  details: string
}

type Stats = {
  totalConfirmed: number
  totalDonations: number
  totalQueries: number
}

export function PaymentsSection() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({ totalConfirmed: 0, totalDonations: 0, totalQueries: 0 })
  const [payments, setPayments] = useState<Payment[]>([])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Payment | null>(null)
  const perPage = 20

  // Load stats and payments whenever page changes
  useEffect(() => {
    fetch('/api/admin/payments/stats')
      .then((r) => r.json())
      .then(setStats)

    fetch(`/api/admin/payments?limit=${perPage}&page=${page}`)
      .then((r) => r.json())
      .then(setPayments)
  }, [page])

  // Calculate last page for disabling Next
  const lastPage = Math.ceil(stats.totalConfirmed / perPage)

  return (
    <section className="space-y-8">
      {/* Stats + Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded shadow flex items-center">
          <CurrencyDollarIcon className="w-8 h-8 text-green-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Total Payments Confirmed</p>
            <p className="text-2xl font-bold">{stats.totalConfirmed}</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/admin/dashboard/payments/new')}
          className="bg-blue-500 text-white p-6 rounded shadow hover:bg-blue-600 transition flex items-center justify-center"
        >
          <PlusIcon className="w-6 h-6 mr-2" />
          Add New Payment
        </button>

        <button
          onClick={() => router.push('/admin/dashboard/payments/donations')}
          className="bg-white p-6 rounded shadow flex items-center hover:bg-gray-50 transition"
        >
          <GiftIcon className="w-8 h-8 text-purple-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Donations</p>
            <p className="text-2xl font-bold">{stats.totalDonations}</p>
          </div>
        </button>

        <button
          onClick={() => router.push('/admin/dashboard/payments/queries')}
          className="bg-white p-6 rounded shadow flex items-center hover:bg-gray-50 transition"
        >
          <QuestionMarkCircleIcon className="w-8 h-8 text-yellow-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Query Payments</p>
            <p className="text-2xl font-bold">{stats.totalQueries}</p>
          </div>
        </button>
      </div>

      {/* Payments Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              {['Date', 'Reference', 'Initiated By'].map((h) => (
                <th key={h} className="px-4 py-2 text-sm font-medium text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelected(p)}
              >
                <td className="px-4 py-3">{new Date(p.date).toLocaleString()}</td>
                <td className="px-4 py-3">{p.reference}</td>
                <td className="px-4 py-3">{p.initiatedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === lastPage}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <p><strong>Date:</strong> {new Date(selected.date).toLocaleString()}</p>
            <p><strong>Reference:</strong> {selected.reference}</p>
            <p><strong>Initiated By:</strong> {selected.initiatedBy}</p>
            <p><strong>Amount:</strong> ${selected.amount.toFixed(2)}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Details:</strong></p>
            <p className="whitespace-pre-wrap border p-2 rounded">{selected.details}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
