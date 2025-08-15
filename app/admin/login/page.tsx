'use client'
import React, { FormEvent, useState } from 'react'
import { Input } from '@/app/components/Input'
import { Loader } from '@/app/components/Loader'
import { CloseButton } from '@/app/components/CloseButton'
import { useToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'         
import { useAuth } from '../../../lib/authProvider'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter() 
  const { refreshUser } = useAuth()
  const toast = useToast()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials : 'include',
      })


      if (!res.ok) throw new Error('Login failed')
      toast('Logged in successfully!', { type: 'success' })

      await refreshUser()
      
      router.push('/admin/dashboard') 
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-filter backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-sm"
      >
        <CloseButton />

        <h2 className="text-1xl font-semibold mb-6 text-left">Admin Login</h2>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

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
          className="w-full flex justify-center items-center mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? <Loader /> : 'Login'}
        </button>

        {/* Forgot password link */}
        <div className="mt-4 text-center">
          <Link
            href="/admin/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </form>
    </div>
  )
}
