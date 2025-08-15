// components/member/ProfileSection.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useToast }        from '@/lib/toast'
import { useAuth }         from '@/lib/authProvider'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type ProfileData = {
  name: string
  email: string
  dateOfBirth: Date | null
  title?: string
  phone?: string
  address?: string
  photoUrl?: string
}

export function ProfileSection() {
  const { user } = useAuth()
  const toast = useToast()

  // form state
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    dateOfBirth: null,
    title: '',
    phone: '',
    address: '',
    photoUrl: '',
  })
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // seed initial state from user
  useEffect(() => {
    if (!editMode && user) {
      setProfile({
        name: user.name || '',
        email: user.email,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
        title:       user.title   && user.title.trim()   !== '' ? user.title   : profile.title,
        phone:       user.phone   && user.phone.trim()   !== '' ? user.phone   : profile.phone,
        address:     user.address && user.address.trim() !== '' ? user.address : profile.address,
        photoUrl:    user.image   && user.image.trim()   !== '' ? user.image   : profile.photoUrl,
    })
    }
  }, [user, editMode])

  const handleChange = (k: keyof ProfileData, v: string) =>
    setProfile(p => ({ ...p, [k]: v }))

  // save text fields
  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/members/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()           
      if (!res.ok) throw new Error(data.error || 'Failed')
      toast('Profile updated!', { type: 'success' })
      setEditMode(false)

    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Error saving profile', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // upload photo immediately on file select
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return
    setUploading(true)
    const form = new FormData()
    form.append('photo', acceptedFiles[0])
    try {
      const res = await fetch('/api/members/profile/photo', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const { photoUrl, error } = await res.json()
      if (!res.ok || !photoUrl) throw new Error(error || 'Upload failed')
      setProfile(p => ({ ...p, photoUrl }))
      toast('Photo uploaded!', { type: 'success' })
    } catch (err: any) {
      console.error(err)
      toast(err.message || 'Upload error', { type: 'error' })
    } finally {
      setUploading(false)
    }
  }, [toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  if (!user) return null

return (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold">Your Profile</h2>

    {/* Photo upload using react-dropzone */}
    <div>
      <label className="block text-sm font-medium mb-1">Profile Photo</label>
      <div
        {...getRootProps()}
        className="flex items-center justify-center w-48 h-48 border-2 border-dashed rounded cursor-pointer bg-white"
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading…</p>
        ) : profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded"
          />
        ) : isDragActive ? (
          <p>Drop the image here…</p>
        ) : (
          <p>Drag & drop or click to upload</p>
        )}
      </div>
    </div>

    {/* Fields grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {([
        ['Full Name', 'name', 'text'],
        ['Email', 'email', 'email'],
        ['Date of Birth', 'dateOfBirth', 'date'],
        ['Title', 'title', 'text'],
        ['Phone', 'phone', 'tel'],
        ['Address', 'address', 'text'],
      ] as [string, keyof ProfileData, string][]).map(([label, key, type]) => {
        // For the dateOfBirth field, we swap in DatePicker
        if (key === 'dateOfBirth') {
          return (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              {editMode ? (
                <DatePicker
                  selected={profile.dateOfBirth}
                  onChange={(date: Date | null) =>
                    setProfile(p => ({ ...p, dateOfBirth: date }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="border rounded px-3 py-2 w-full"
                  placeholderText="Select your birth date"
                  maxDate={new Date()}
                />
              ) : profile.dateOfBirth ? (
                <div className="px-3 py-2 bg-white rounded border">
                  {profile.dateOfBirth.toLocaleDateString()}
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded border text-gray-400 italic">
                  Not provided
                </div>
              )}
            </div>
          )
        }

        // All other fields use a normal input or display div
        return (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            {editMode ? (
              <input
                type={type}
                value={(profile[key] as string) || ''}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, [key]: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
              />
            ) : profile[key] ? (
              <div className="px-3 py-2 bg-white rounded border">
                {profile[key]}
              </div>
            ) : (
              <div className="px-3 py-2 bg-gray-50 rounded border text-gray-400 italic">
                Not provided
              </div>
            )}
          </div>
        )
      })}
    </div>

    {/* Action buttons */}
    <div className="flex space-x-4">
      {editMode ? (
        <>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={() => {
              setEditMode(false)
              // reset form here...
            }}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Edit Profile
        </button>
      )}
    </div>
  </div>
)
}