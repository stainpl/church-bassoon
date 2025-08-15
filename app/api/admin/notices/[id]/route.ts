import { NextResponse, NextRequest } from 'next/server'
import { prisma }                   from '@/lib/prisma'
import { verifyJwt }                from '@/lib/auth'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('CHURCH_TOKEN')?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { userId } = verifyJwt(token)

  // Soft delete
  const notice = await prisma.notice.update({
    where: { id: params.id },
    data: {
      removed:   true,
      removedAt: new Date(),
      removedBy: userId,
    },
  })

  return NextResponse.json({ notice })
}
