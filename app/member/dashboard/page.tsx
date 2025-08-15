'use client'

import React, { useState }     from 'react'
import { useAuth }            from '@/lib/authProvider'
import { MemberSidebar }      from '../../components/MemberSidebar'
import type { MemberSectionKey } from '@/types/member'


// Import your section components:
import { ProfileSection }     from '../../components/member/ProfileSection'
import { PaymentsSection }    from '../../components/member/PaymentsSection'
import { DonationsSection }   from '../../components/member/DonationsSection'
import { SettingsSection }    from '../../components/member/SettingsSection'

export default function MemberDashboardPage() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState<MemberSectionKey>('Profile')

  

  const renderSection = () => {
    switch (active) {
      case 'Profile':   return <ProfileSection user={user!} />
      case 'Payments':  return <PaymentsSection user={user!} />
      case 'Donations': return <DonationsSection user={user!} />
      case 'Settings':  return <SettingsSection user={user!} />
    }
  }

  return (
    <>
      <MemberSidebar active={active} onSelect={setActive} onLogout={logout} />

      <div className="flex-1 flex flex-col">
        <header className="px-6 py-4 border-b bg-green-500 flex justify-between">
          <h1 className="text-xl font-semibold text-white">{active}</h1>
          <span className="text-gray-800">{user?.email.split('@')[0]}</span>
        </header>

        <main className="p-6 flex-1 overflow-auto bg-gray-50">
          {renderSection()}
        </main>
      </div>
    </>
  )
}
