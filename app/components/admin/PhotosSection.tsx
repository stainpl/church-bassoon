// components/admin/PhotosSection.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/lib/toast'

type Photo = {
  id: string
  url: string
  thumbnailUrl: string
  uploadedAt: string
  uploadedBy: string
}

type Stats = { totalImages: number }

export function PhotosSection() {
  const router = useRouter()
  const toast = useToast()

  const [stats, setStats] = useState<Stats>({ totalImages: 0 })
  const [photos, setPhotos] = useState<Photo[]>([])
  const [page, setPage] = useState(1)
  const perPage = 20

  useEffect(() => {
    // fetch total and page data
    fetch('/api/admin/photos/stats')
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setStats)
      .catch(() => toast('Failed to load stats', { type: 'error' }))

    fetch(`/api/admin/photos?limit=${perPage}&page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(setPhotos)
      .catch(() => toast('Failed to load photos', { type: 'error' }))
  }, [page, toast])

  const lastPage = Math.ceil(stats.totalImages / perPage)

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Delete this image?')) return
    try {
      const res = await fetch(`/api/admin/photos/${photo.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast('Image deleted', { type: 'success' })
      setPage(1)
    } catch {
      toast('Failed to delete image', { type: 'error' })
    }
  }

  return (
    <section className="space-y-8">
      {/* Stats + Add */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow flex items-center">
          <PhotoIcon className="w-8 h-8 text-indigo-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Total Images</p>
            <p className="text-2xl font-bold">{stats.totalImages}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard/photos/new')}
          className="bg-blue-500 text-white p-6 rounded shadow hover:bg-blue-600 transition flex items-center justify-center"
        >
          <PlusIcon className="w-6 h-6 mr-2" />
          Add New Image
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.thumbnailUrl}
              alt="Uploaded photo"
              className="w-full h-24 object-cover rounded cursor-pointer"
              onClick={() => handleDelete(photo)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded">
              <TrashIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        ))}
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
    </section>
  )
}
