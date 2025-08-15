'use client'
import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '../../components/Input'
import { DatePicker } from '../../components/DatePicker'
import { Loader } from '../../components/Loader'
import { CloseButton } from '../../components/CloseButton'
import { useToast } from '../../../lib/toast'

export default function MemberRegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    dob: '',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const isValid =
    form.fullName &&
    form.email &&
    form.dob &&
    form.password.length >= 6 &&
    form.password === form.confirm

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isValid) {
      toast('Please fill all fields correctly', { type: 'error' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          dob: form.dob,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (res.status ===409 ) {
        toast('Email already registered, log in instead.', { type: 'error'})
      } else if (!res.ok) {
        toast(data.error || 'Registration failed.', { type: 'error'})
      } else {

      toast('Registration successful, You can now login', { type: 'success' })
      router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/admin-bg.png')" }}
    >
      {/* semi‐opaque blurred overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-filter backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        
        <CloseButton onClick={() => router.back()} />

        <h2 className="text-1xl font-bold mb-6 text-left">Register as new member</h2>
        {error && <p className="text-red-600 mb-4 text-sm text-center">{error}</p>}

        <Input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <DatePicker
          name="dob"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          required
        />

        <Input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Input
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full mt-6 py-2 flex items-center justify-center bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? <Loader /> : 'Register'}
        </button>
      </form>
    </div>
  )
}
