// app/api/admin/blogs/uploadCover/route.ts
import { NextResponse, NextRequest } from 'next/server'
import multiparty                   from 'multiparty'
import fs                           from 'fs'
import path                         from 'path'
import { randomUUID }               from 'crypto'

export const runtime = 'nodejs'
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  // parse form-data
  const form = new multiparty.Form()
  const { files } = await new Promise<any>((resolve, reject) =>
    form.parse(req as any, (e, flds, fls) => (e ? reject(e) : resolve({ files: fls })))
  )
  const file = files.cover?.[0]
  if (!file || !file.path) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const data = await fs.promises.readFile(file.path)
  const ext  = path.extname(file.originalFilename) || '.jpg'
  const name = `${randomUUID()}${ext}`
  const dest = path.join(process.cwd(), 'public', 'uploads', name)
  await fs.promises.mkdir(path.dirname(dest), { recursive: true })
  await fs.promises.writeFile(dest, data)

  return NextResponse.json({ url: `/uploads/${name}` })
}