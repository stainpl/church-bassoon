// app/api/admin/blogs/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma }                  from '@/lib/prisma'
import { verifyJwt }               from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // IMPORTANT: do not assign to params — it’s read-only
  const blogId = params.id

  // … authenticate, read JSON, update …
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const blogId = params.id
  // … authenticate, delete …
}