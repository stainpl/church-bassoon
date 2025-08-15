// app/api/admin/login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signJwt } from '@/lib/auth'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // 1) Find user by email
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // 2) Verify against the correct field
  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // 3) Sign JWT & set cookie
  const token = signJwt({ userId: user.id, role: user.role })
  const res = NextResponse.json({
    user: { id: user.id, role: user.role, email: user.email },
  })
  res.cookies.set('CHURCH_TOKEN', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
  })

  return res
}
