// app/api/member/register/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface RegisterBody {
  fullName?: string
  name?: string
  email?: string
  password?: string
  dob?: string      // client field
  dateOfBirth?: string  // API field
}

export async function POST(req: NextRequest) {
  let body: RegisterBody
  try {
    body = await req.json()
    console.log('Register payload:', body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Accept either field name
  const name = body.name ?? body.fullName
  const dateStr = body.dateOfBirth ?? body.dob
  const email = body.email
  const password = body.password

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 })
  }
  if (!dateStr) {
    return NextResponse.json(
      { error: 'Date of birth is required' },
      { status: 400 }
    )
  }

  // parse date
  let dob: Date
  try {
    dob = new Date(dateStr)
    if (isNaN(dob.getTime())) throw new Error()
  } catch {
    return NextResponse.json(
      { error: 'Invalid date format, use YYYY-MM-DD' },
      { status: 400 }
    )
  }

  // check duplicate
  if (await prisma.user.findUnique({ where: { email } })) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  // hash pw
  const passwordHash = await bcrypt.hash(password, 10)

  // create
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        dateOfBirth: dob,
        role: 'MEMBER',
      },
      select: {
        id: true,
        uniqueId: true,
        name: true,
        email: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
      },
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
