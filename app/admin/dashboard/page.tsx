"use client"

import { useState } from "react"
import { useAuth } from "../../../lib/authProvider"
import type { SectionKey } from "@/types/admin"
import { Sidebar } from "../../components/Sidebar"
import { BlogsSection } from "../../components/admin/BlogsSection"
import { MembersSection } from "../../components/admin/MembersSection"
import { PaymentsSection } from "../../components/admin/PaymentsSection"
import { NoticeSection } from "../../components/admin/NoticeSection"
import { AdminsSection } from "../../components/admin/AdminsSection"
import { PhotosSection } from "../../components/admin/PhotosSection"
import { VideosSection } from "../../components/admin/VideosSection"
import { NewsletterSection } from "../../components/admin/NewsletterSection"
import { Loader } from "@/app/components/Loader"

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const [active, setActive] = useState<SectionKey>("Blogs")



  // Show loading state & go to admin login
  if (loading) {
    return <Loader  />
  }

  if (!user) {
    return null
    
  }

  const renderSection = () => {
    switch (active) {
      case "Blogs":
        return <BlogsSection />
      case "Members":
        return <MembersSection />
      case "Payments":
        return <PaymentsSection />
      case "Notice":
        return <NoticeSection />
      case "Admins":
        return <AdminsSection />
      case "Photos":
        return <PhotosSection />
      case "Videos":
        return <VideosSection />
      case "Newsletter":
        return <NewsletterSection />
      default:
        return <div>Section not found</div>
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar active={active} onSelect={setActive} onLogout={logout} />
      <div className="flex-1 flex flex-col">
        <header className="px-6 py-4 border-b bg-blue-500 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">{active} Dashboard</h1>
          <div className="text-blue-100">
            <span>Hello, {user.email}</span>
            <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">{user.role}</span>
          </div>
        </header>
        <main className="p-6 flex-1 overflow-auto bg-gray-300">{renderSection()}</main>
      </div>
    </div>
  )
}
