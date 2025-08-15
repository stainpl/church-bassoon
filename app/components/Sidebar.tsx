'use client'

import React, { useState } from 'react'
import type { SectionKey } from '@/types/admin'
import { SECTION_KEYS } from '@/types/admin'
import {
  NewspaperIcon,
  UserGroupIcon,
  CreditCardIcon,
  BellIcon,
  UserIcon,
  PhotoIcon,
  VideoCameraIcon,
  MapIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const ICON_MAP: Record<SectionKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Blogs: NewspaperIcon,
  Members: UserGroupIcon,
  Payments: CreditCardIcon,
  Notice: BellIcon,
  Admins: UserIcon,
  Photos: PhotoIcon,
  Videos: VideoCameraIcon,
  Newsletter: MapIcon,
}

type SidebarProps = {
  active: SectionKey
  onSelect: (key: SectionKey) => void
  onLogout: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  active,
  onSelect,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        flex flex-col
        bg-gray-500 border-r
        ${collapsed ? 'w-16' : 'w-64'}
        transition-width duration-200
      `}
    >
      <div className="flex-1">
        {SECTION_KEYS.map((key) => {
          const Icon = ICON_MAP[key]
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`
                flex items-center space-x-3
                w-full pt-6 pb-3 px-3
                hover:bg-blue-500 transition-colors
                ${active === key ? 'bg-blue-500' : ''}
              `}
            >
              <Icon className="w-6 h-6 text-gray-700" />
              {!collapsed && <span className="text-gray-800">{key}</span>}
            </button>
          )
        })}
      </div>

      <hr className="my-2 border-gray-200" />

      <button
        onClick={onLogout}
        className="flex items-center space-x-3 p-3 hover:bg-blue-500 transition-colors"
      >
        <UserIcon className="w-6 h-6 text-gray-700" />
        {!collapsed && <span className="text-red-500">Logout</span>}
      </button>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="self-end mb-4 mr-2 p-1 bg-gray-200 rounded-full hover:bg-blue-500 transition"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </aside>
  )
}
