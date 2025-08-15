// app/api/admin/notices/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma }                   from '@/lib/prisma'
import { verifyJwt }                from '@/lib/auth'

export async function POST(req: NextRequest) {
  // 1) Authenticate
  const token = req.cookies.get('CHURCH_TOKEN')?.value
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { userId } = verifyJwt(token)

  // 2) Parse incoming text
  const { text } = (await req.json()) as { text: string }
  if (!text || !text.trim()) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 })
  }

  // 3) Run a transaction:
  //    a) soft-delete existing active notice (if any)
  //    b) create the new one
  const [deletedCount, newNotice] = await prisma.$transaction([
    // a) soft-delete: update all where removed=false
    prisma.notice.updateMany({
      where: { removed: false },
      data: {
        removed:   true,
        removedBy: userId,
        removedAt: new Date(),
      },
    }),
    // b) create new active notice
    prisma.notice.create({
      data: {
        text:     text.trim(),
        addedBy:  userId,
        removed:  false,
      },
    }),
  ])

  // deletedCount.count tells you how many were marked removed (0 or 1)
  return NextResponse.json({
    notice: newNotice,
    removedPrevious: deletedCount.count > 0,
  })
}
