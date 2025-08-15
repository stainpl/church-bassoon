// components/MemberSidebar.tsx
'use client'

import React, { useState } from 'react'
import type { MemberSectionKey } from '@/types/member'
import { MEMBER_SECTIONS }      from '@/types/member'
import {
  UserCircleIcon,
  CreditCardIcon,
  GiftIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const ICONS: Record<MemberSectionKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Profile:   UserCircleIcon,
  Payments:  CreditCardIcon,
  Donations: GiftIcon,
  Settings:  Cog6ToothIcon,
}

type Props = {
  active: MemberSectionKey
  onSelect: (key: MemberSectionKey) => void
  onLogout: () => void
}

export const MemberSidebar: React.FC<Props> = ({ active, onSelect, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`flex flex-col bg-gray-500 border-r transition-width ${collapsed ? 'w-16' : 'w-64'} 
    transition-width duration-200`}>
      <div className="flex-1">
        {MEMBER_SECTIONS.map((sec) => {
          const Icon = ICONS[sec]
          return (
            <button
              key={sec}
              onClick={() => onSelect(sec)}
              className={`flex items-center p-3 w-full pt-6 pb-3 px-3 hover:bg-green-500 ${
                active === sec ? 'bg-green-500' : ''
              }`}
            >
              <Icon className="w-6 h-6 text-gray-700" />
              {!collapsed && <span className="ml-3 text-gray-800">{sec}</span>}
            </button>
          )
        })}
      </div>

      <hr className="my-2 border-gray-200" />

      <button
        onClick={onLogout}
        className="flex items-center p-3 w-full hover:bg-green-500"
      >
        <UserCircleIcon className="w-6 h-6 text-gray-700" />
        {!collapsed && <span className="ml-3 text-red-500">Logout</span>}
      </button>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="m-2 p-1 bg-gray-200 rounded-full self-end hover:bg-green-500"
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
