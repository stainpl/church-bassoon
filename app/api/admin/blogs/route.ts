// app/api/admin/blogs/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma }                   from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get('limit')  ?? '10')
  const page  = Number(searchParams.get('page')   ?? '1')
  const skip  = (page - 1) * limit

  const blogs = await prisma.blog.findMany({
    take: limit,
    skip,
    orderBy: { createdAt: 'desc' },
    include: {
      authorUser: { select: { name: true, email: true } },
    },
  })

  // Map into the shape your component expects
  const data = blogs.map((b) => {
    const au = b.authorUser

    const authorName = au?.name
      ? au.name
      : au?.email
        ? au.email.split('@')[0]
        : 'Unknown'

    return {
      id:        b.id,
      title:     b.title,
      authorName,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      coverUrl:  b.coverUrl,
      content:   b.content,
    }
  })

  const total = await prisma.blog.count()
  return NextResponse.json({ blogs: data, stats: { total } })
}
