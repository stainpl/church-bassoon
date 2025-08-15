// app/api/admin/blogs/stats/route.ts
import { NextResponse } from 'next/server'
import { prisma }       from '@/lib/prisma'

export async function GET() {
  const total = await prisma.blog.count()
  return NextResponse.json({ total })
}