'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/authProvider'
import { NewspaperIcon } from '@heroicons/react/24/outline'
import { useToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { format } from 'date-fns'
import SlateEditor from './SlateEditor'
import { Descendant } from 'slate'

// Initialize as unknown then cast to Descendant[] to satisfy TS
const initialValue = [
  { type: 'paragraph', children: [{ text: 'Start typing…' }] },
] as unknown as Descendant[]

type Blog = {
  id: string
  title: string
  authorName: string
  createdAt: string
  updatedAt: string
  coverUrl?: string
  content: string
}

export function BlogsSection() {
  const { user } = useAuth()
  const toast = useToast()
  const router = useRouter()

  const [stats, setStats] = useState({ total: 0 })
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [page, setPage] = useState(1)
  const perPage = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [current, setCurrent] = useState<Partial<Blog>>({ title: '', content: '', coverUrl: '' })
  // Slate document state
  const [doc, setDoc] = useState<Descendant[]>(initialValue)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/blogs?limit=${perPage}&page=${page}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to load blogs')

      const { blogs: fetched, stats: st } = await res.json()
      setBlogs(fetched)
      setStats(st)
    } catch (err: any) {
      console.error('Error loading blogs/stats:', err)
      toast(err.message || 'Error loading blogs', { type: 'error' })
    }
  }, [page, perPage, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onDrop = useCallback(
    async (files: File[]) => {
      if (!files.length) return
      const form = new FormData()
      form.append('cover', files[0])
      try {
        const res = await fetch('/api/admin/blogs/uploadCover', {
          method: 'POST',
          body: form,
          credentials: 'include',
        })
        const { url, error } = await res.json()
        if (!url) throw new Error(error || 'Upload failed')
        setCurrent((c) => ({ ...c, coverUrl: url }))
        toast('Cover uploaded!', { type: 'success' })
      } catch (e: any) {
        toast(e.message || 'Upload failed', { type: 'error' })
      }
    },
    [toast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  const openAdd = () => {
    setIsEditing(false)
    setCurrent({ title: '', content: '', coverUrl: '' })
    setDoc(initialValue)
    setIsModalOpen(true)
  }

  const openEdit = (b: Blog) => {
    setIsEditing(true)
    setCurrent({ ...b })
    try {
      const parsed = JSON.parse(b.content)
      setDoc(parsed)
    } catch {
      setDoc(initialValue)
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!confirm(isEditing ? 'Save changes to this blog?' : 'Publish this new blog?')) return

    const url = isEditing ? `/api/admin/blogs/${current.id}` : '/api/admin/blogs'
    const method = isEditing ? 'PUT' : 'POST'
    const payload = {
      title: current.title,
      // Serialize Slate document to JSON
      content: JSON.stringify(doc),
      coverUrl: current.coverUrl,
      authorName: user?.email.split('@')[0] ?? 'Admin',
    }

    try {
      const res = await fetch(url as string, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = (await res.json()).error || 'Save failed'
        throw new Error(err)
      }
      toast(isEditing ? 'Blog updated!' : 'Blog published!', { type: 'success' })
      setIsModalOpen(false)
      fetchData()
    } catch (e: any) {
      toast(e.message || 'Save failed', { type: 'error' })
    }
  }

  return (
    <section className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow flex items-center">
          <NewspaperIcon className="w-8 h-8 text-blue-500 mr-4" />
          <div>
            <p className="text-sm font-medium">Total Blogs</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="bg-green-500 text-white p-6 rounded shadow hover:bg-green-600 transition flex items-center justify-center"
        >
          + Add New Blog
        </button>
      </div>

      {/* Blogs Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              {['Title', 'By Admin', 'Created At'].map((h) => (
                <th key={h} className="px-4 py-2 text-sm font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blogs.map((b) => (
              <tr
                key={b.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => openEdit(b)}
              >
                <td className="px-4 py-3">{b.title}</td>
                <td className="px-4 py-3">{b.authorName}</td>
                <td className="px-4 py-3">{format(new Date(b.createdAt), 'PPP p')}</td>
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
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-4">
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit Blog' : 'New Blog'}</h2>

            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Title"
              value={current.title}
              onChange={(e) => setCurrent((c) => ({ ...c, title: e.target.value }))}
            />

            {/* Cover Image */}
            <div>
              <label className="block mb-1">Cover Image</label>
              <div {...getRootProps()} className="flex items-center justify-center w-full h-10 border-1 border-dashed rounded cursor-pointer bg-gray-50">
                <input {...getInputProps()} />
                {current.coverUrl ? (
                  <img src={current.coverUrl} alt="cover" className="max-h-full object-contain" />
                ) : isDragActive ? (
                  <p>Drop image here…</p>
                ) : (
                  <p className="text-gray-500">Click or drag to upload</p>
                )}
              </div>
            </div>

            {/* Body */}
            <div>
              <label className="block mb-1">Body</label>
              <SlateEditor value={doc} onChange={setDoc} />
            </div>

            <div className="text-sm text-gray-500">
              By <strong>{user?.email.split('@')[0]}</strong>{' '}
              {isEditing && current.updatedAt ? `· updated ${format(new Date(current.updatedAt), 'PPP p')}` : ''}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              {isEditing && (
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this post?')) {
                      await fetch(`/api/admin/blogs/${current.id}`, {
                        method: 'DELETE',
                        credentials: 'include',
                      })
                      toast('Blog deleted', { type: 'success' })
                      setIsModalOpen(false)
                      fetchData()
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditing ? 'Save Changes' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
