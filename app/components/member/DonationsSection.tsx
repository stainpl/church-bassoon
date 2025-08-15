// components/member/ProfileSection.tsx
import React from 'react'
type Props = { user: { name: string; email: string; dateOfBirth: Date | null } }
export const DonationsSection : React.FC<Props> = ({ user }) => (
  <div>
    <h2 className="text-lg font-semibold">Donations</h2>
    <p>Name: {user.name}</p>
    <p>Email: {user.email}</p>
    <p>DOB: {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
  </div>
)

