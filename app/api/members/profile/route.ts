// app/api/members/profile/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { verifyJwt }                from '@/lib/auth'
import { prisma }                   from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  // 1. Authenticate via JWT cookie
  const token = req.cookies.get('CHURCH_TOKEN')?.value
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  let payload: { userId: string }
  try {
    payload = verifyJwt(token)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // 2. Parse body
  const {
    name,
    email,
    dateOfBirth,
    title,
    phone,
    address,
  } = (await req.json()) as {
    name?: string
    email?: string
    dateOfBirth?: string
    title?: string
    phone?: string
    address?: string
  }

  // 3. Basic required‐field validation
  if (!name || !email || !dateOfBirth) {
    return NextResponse.json(
      { error: 'Name, email, and dateOfBirth are required' },
      { status: 400 }
    )
  }

  // 4. Check email uniqueness if changed
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing && existing.id !== payload.userId) {
    return NextResponse.json(
      { error: 'That email is already in use' },
      { status: 409 }
    )
  }

  // 5. Build the `data` object dynamically
  const data: Record<string, any> = {
    name: name.trim(),
    email: email.trim(),
    dateOfBirth: new Date(dateOfBirth),
  }
  if (title !== undefined && title.trim() !== '') {
    data.title = title.trim()
  }
  if (phone !== undefined && phone.trim() !== '') {
    data.phone = phone.trim()
  }
  if (address !== undefined && address.trim() !== '') {
    data.address = address.trim()
  }

  // 6. Perform the update
  let updated
  try {
    updated = await prisma.user.update({
      where: { id: payload.userId },
      data,
      select: {
        id: true,
        uniqueId: true,
        name: true,
        email: true,
        dateOfBirth: true,
        title: true,
        phone: true,
        address: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }

  // 7. Return the freshly updated user
  return NextResponse.json({ user: updated })
}