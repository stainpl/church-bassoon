'use client'
import React, { FormEvent, useState } from 'react'
import { Input } from '@/app/components/Input'
import { Loader } from '@/app/components/Loader'
import { CloseButton } from '@/app/components/CloseButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '../../../lib/toast'
import { useAuth } from '../../../lib/authProvider'

export default function MemberLoginPage() {
  const router = useRouter()
  const toast = useToast()
  const { refreshUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials : 'include',
      })

      if (!res.ok) throw new Error('Login failed')

      // redirect or update session
      toast('Login successful!', { type: 'success' })

      await refreshUser()

      router.push('/member/dashboard')

    } catch (err: any) {
      setError(err.message || 'Unexpected error')
      toast(err.message || 'Unexpected error', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/admin-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur p-8 rounded-lg shadow-xl w-full max-w-sm"
      >
        <CloseButton />

        <h2 className="text-1xl font-bold mb-6 text-left">Member Login</h2>
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <Input
          name="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2 flex items-center justify-center bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? <Loader /> : 'Login'}
        </button>

        {/* Forgot password link */}
        <div className="mt-4 text-center">
          <Link
            href="/member/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  )
}
