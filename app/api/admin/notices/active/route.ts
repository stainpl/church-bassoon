// app/api/admin/notices/active/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  // Return the single currently active (not-removed) notice,
  // most recently updated or created.
  const notice = await prisma.notice.findFirst({
    where: { removed: false },
    orderBy: { updatedAt: 'desc' },
    include: {
      addedByUser: { select: { name: true } },   // relation field
    },
  })

  if (!notice) {
    return NextResponse.json({ notice: null })
  }

  return NextResponse.json({
    notice: {
      id: notice.id,
      text: notice.text,
      addedBy: notice.addedByUser?.name ?? 'N/A',
    },
  })
}
