// app/api/member/login/route.ts

import { NextResponse, NextRequest } from 'next/server'
import { prisma }                  from '@/lib/prisma'
import { verifyPassword, signJwt } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // 1) Find the member by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
      },
    })

    if (!user || user.role !== 'MEMBER') {
      return NextResponse.json(
        { error: 'Invalid email or not a member' },
        { status: 404 }
      )
    }

    // 2) Check the password
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    // 3) Sign a JWT & set it in a cookie
    const token = signJwt({ userId: user.id, role: user.role })
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role },
    })
    res.cookies.set('CHURCH_TOKEN', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (err) {
    console.error('Member login error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}