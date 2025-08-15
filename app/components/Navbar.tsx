// components/NavBar.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/authProvider'
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { Inter } from 'next/font/google'
import {
  FaBook,
  FaChurch,
  FaEnvelope,
  FaChild,
  FaMusic,
  FaHandsHelping,
  FaGlobe,
  FaCalendarAlt,
  FaClock,
  FaClipboardCheck,
  FaSignInAlt,
  FaUserPlus,
  FaUserTie,
} from 'react-icons/fa'
import { LoaderCentered } from './LoaderCentered'

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] })



type NavItem = {
  label: string
  href?: string
  icon?: React.ReactNode
  subItems?: { label: string; href: string; icon?: React.ReactNode }[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'About',
    subItems: [
      { label: 'What We Teach', href: '/about/teach', icon: <FaBook /> },
      { label: 'The Church', href: '/about/church', icon: <FaChurch /> },
      { label: 'Contact Us', href: '/about/contact', icon: <FaEnvelope /> },
    ],
  },
  {
    label: 'Ministries',
    subItems: [
      { label: 'Youth', href: '/ministries/youth', icon: <FaChild /> },
      { label: 'Music', href: '/ministries/music', icon: <FaMusic /> },
      { label: 'Outreach', href: '/ministries/outreach', icon: <FaHandsHelping /> },
      { label: 'Missions', href: '/ministries/missions', icon: <FaGlobe /> },
    ],
  },
  {
    label: 'Events',
    subItems: [
      { label: 'Upcoming', href: '/events/upcoming', icon: <FaCalendarAlt /> },
      { label: 'Past', href: '/events/past', icon: <FaClock /> },
      { label: 'Register', href: '/events/register', icon: <FaClipboardCheck /> },
    ],
  },
  {
    label: 'Member',
    subItems: [
      { label: 'Login', href: '/member/login', icon: <FaSignInAlt /> },
      { label: 'Sign Up', href: '/member/register', icon: <FaUserPlus /> },
      { label: 'Admin', href: '/admin/login', icon: <FaUserTie /> },
    ],
  },
]

export const NavBar: React.FC = () => {
  const { user, loading } = useAuth()
  const path = usePathname()

  // 1) While we’re checking session: show only “Loading…”
  if (loading) {
    return < LoaderCentered />
  }

  // 2) If logged in (admin or member), or if we’re on an /admin page,
  if (path.startsWith('/admin') || path.startsWith('/member')) {
    return (
      <header className="w-full border-b bg-gray-900 px-4 py-0.5 flex items-center">
       

        {/* Only show dashboard link & logout if user is actually logged in */}
        {user && (
          <div className="flex items-center space-x-4">
            <Link
              href={
                user.role === 'ADMIN'
                  ? '/admin/dashboard'
                  : '/member/dashboard'
              }
            >    
            </Link>
          </div>
        )}
      </header>
    )
  }

  // 3) Otherwise (not logged in, not an /admin route) → render full public nav:
  return <PublicNav />
}

// Extract the full desktop+mobile menu into its own small component:
const PublicNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // close dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenIndex(null)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <header className={`${inter.className} w-full border-b`}>
      {/* top bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-gray-800">
        <div className="text-2xl font-bold text-gray-200">Church Pilar</div>

        {/* desktop menu */}
        <nav className="hidden md:flex space-x-6">
          {NAV_ITEMS.map((item, idx) => (
            <div
              key={item.label}
              ref={openIndex === idx ? dropdownRef : null}
              className="relative"
              onMouseEnter={() => setOpenIndex(idx)}
              onMouseLeave={() => setOpenIndex(null)}
            >
              <button className="flex items-center space-x-1 text-gray-200 hover:text-blue-400">
                <span>{item.label}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              {openIndex === idx && item.subItems && (
                <div className="absolute top-full mt-1 bg-gray-700 shadow-lg rounded p-2 min-w-[12rem] z-20">
                  {item.subItems.map(si => (
                    <Link
                      key={si.label}
                      href={si.href!}
                      className="flex items-center space-x-2 p-3 mb-1 bg-gray-600 border border-gray-500 rounded hover:bg-gray-500 text-gray-200"
                    >
                      <span className="text-lg">{si.icon}</span>
                      <span>{si.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* mobile hamburger */}
        <button
          className="md:hidden text-gray-200"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800/95 backdrop-blur-sm p-6 z-30 overflow-auto">
          <div className="flex justify-end">
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 hover:bg-gray-700 rounded text-gray-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item, idx) => (
              <div key={item.label} className="space-y-2">
                <button
                  onClick={() =>
                    setMobileOpenIndex(mobileOpenIndex === idx ? null : idx)
                  }
                  className="w-full text-left flex justify-between items-center bg-gray-700 p-3 rounded hover:bg-gray-600 text-gray-200"
                >
                  <span className="text-lg font-medium">{item.label}</span>
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform ${
                      mobileOpenIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileOpenIndex === idx && item.subItems && (
                  <div className="pl-4 flex flex-col space-y-2 mt-1">
                    {item.subItems.map(si => (
                      <Link
                        key={si.label}
                        href={si.href!}
                        className="flex items-center space-x-2 p-3 bg-gray-600 border border-gray-500 rounded hover:bg-gray-500 text-gray-200"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="text-lg">{si.icon}</span>
                        <span>{si.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
