// app/api/members/profile/photo/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { verifyJwt }                from '@/lib/auth'
import { prisma }                   from '@/lib/prisma'
import { randomUUID }               from 'crypto'
import fs                           from 'fs'
import path                         from 'path'

export const runtime = 'nodejs'
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  // 1) Authenticate
  const token = req.cookies.get('CHURCH_TOKEN')?.value
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { userId } = verifyJwt(token)

  // 2) Parse multipart via Web API
  let formData: FormData
  try {
    formData = await req.formData()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('photo') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // 3) Read the Blob into a Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 4) Generate filename & save
  const ext = path.extname(file.name) || '.jpg'
  const filename = `${randomUUID()}${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.promises.mkdir(uploadDir, { recursive: true })
  const filepath = path.join(uploadDir, filename)
  await fs.promises.writeFile(filepath, buffer)

  const photoUrl = `/uploads/${filename}`

  // 5) Persist to user record
  await prisma.user.update({
    where: { id: userId },
    data: { image: photoUrl },
  })

  // 6) Return JSON
  return NextResponse.json({ photoUrl })
}