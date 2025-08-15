"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"


type User = {
  id: string
  role: "ADMIN" | "MEMBER"
  email: string
  name: string
  dateOfBirth: string | null
  title?: string
  phone?: string
  address?: string
  image?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include",
      })

      const data = await res.json()
      console.log("Session fetch result:", data)

      if (data.user) {
        setUser({
          ...data.user,
          dateOfBirth: data.user.dateOfBirth,
        })
      } else {
        setUser(null)
        console.log("No user in session:", data.error)
      }
    } catch (error) {
      console.error("Session fetch error:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    await fetchUser()
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const logout = async () => {
  
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      })
      
      setUser(null)
      

      router.push(user?.role === "ADMIN" ? "/admin/login" : "/member/login")
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/admin/login")
      
    }
  }

  return <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
