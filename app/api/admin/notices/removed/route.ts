// app/api/admin/notices/removed/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma }                   from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit') ?? 20)
  const page  = Number(searchParams.get('page')  ?? 1)
  const skip  = (page - 1) * limit

  const notices = await prisma.notice.findMany({
    where: { removed: true },
    orderBy: { removedAt: 'desc' },
    take: limit,
    skip,
    include: {
      addedByUser:   { select: { name: true } },
      removedByUser: { select: { name: true } },
    },
  })

  const clean = notices.map((n) => ({
    id:        n.id,
    text:      n.text,
    addedBy:   n.addedByUser?.name   ?? 'N/A',
    removedBy: n.removedByUser?.name ?? 'N/A',
    removedAt: n.removedAt          ? n.removedAt.toISOString() : null,
  }))

  return NextResponse.json(clean)
}
