// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/authProvider'
import { ToastProvider } from '@/lib/toast'
import { Roboto } from 'next/font/google'
import { NoticeBar } from './components/NoticeBar'
import { NavBar } from './components/NavBar'
import { ToastContainer } from './components/ToastContainer'
import { prisma } from '@/lib/prisma'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

export const metadata = {
  title: 'My Church App',
  description: 'Church management and donation portal',
}

//  marking an async to await Prisma
export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // 1. Load the most recent non-removed notice,
  // including the Admin who added it.
  const row = await prisma.notice.findFirst({
    where: { removed: false },
    orderBy: { updatedAt: 'desc' },
    include: { addedByUser: { select: { name: true } } },
  })

  // 2. Build the text for the ticker
  const tickerText = row
    ? `${row.text} — by ${row.addedByUser?.name ?? 'Admin'}`
    : ''

  return (
    <html lang="en" className={roboto.variable}>
      <head />
      <body className="font-roboto bg-gray-600">
        <ToastProvider>
          <AuthProvider>
            {/* top ticker driven by your DB */}
            <NoticeBar text={tickerText} />

            <NavBar />

            {/* page content */}
            <main>{children}</main>

            {/* toast outlet */}
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
