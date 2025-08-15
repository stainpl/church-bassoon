// components/admin/VideosSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VideoCameraIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/lib/toast'

type Video = {
  id: string
  thumbnailUrl: string
  videoUrl: string
  uploadedAt: string
  uploadedBy: string
}

type Stats = { totalVideos: number }

export function VideosSection() {
  const router = useRouter()
  const toast = useToast()

  const [stats, setStats] = useState<Stats>({ totalVideos: 0 })
  const [videos, setVideos] = useState<Video[]>([])
  const [page, setPage] = useState(1)
  const perPage = 20

  useEffect(() => {
    // Fetch stats
    fetch('/api/admin/videos/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load stats')
        return res.json()
      })
      .then(setStats)
      .catch(err => toast(err.message, { type: 'error' }))

    // Fetch video list
    fetch(`/api/admin/videos?limit=${perPage}&page=${page}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load videos')
        return res.json()
      })
      .then(setVideos)
      .catch(err => toast(err.message, { type: 'error' }))
  }, [page, toast])

  const lastPage = Math.ceil(stats.totalVideos / perPage)

  const handleDelete = async (video: Video) => {
    if (!confirm('Delete this video?')) return
    try {
      const res = await fetch(`/api/admin/videos/${video.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast('Video deleted', { type: 'success' })
      setPage(1)
    } catch (err: any) {
      toast(err.message || 'Failed to delete video', { type: 'error' })
    }
  }

  return (
    <section className="space-y-8">
      {/* Stats + Add */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow flex items-center">
          <VideoCameraIcon className="w-8 h-8 text-red-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Total Videos</p>
            <p className="text-2xl font-bold">{stats.totalVideos}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard/videos/new')}
          className="bg-blue-500 text-white p-6 rounded shadow hover:bg-blue-600 transition flex items-center justify-center"
        >
          <PlusIcon className="w-6 h-6 mr-2" />
          Add New Video
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-4 gap-4">
        {videos.map(video => (
          <div key={video.id} className="relative group rounded overflow-hidden">
            <img
              src={video.thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-24 object-cover cursor-pointer"
              onClick={() => handleDelete(video)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition">
              <TrashIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        ))}
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
