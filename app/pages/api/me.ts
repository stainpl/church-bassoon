// pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuthApi } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = requireAuthApi(req, res)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    })
    res.status(200).json(user)
  } catch {
    // requireAuthApi already sent 401
  }
}