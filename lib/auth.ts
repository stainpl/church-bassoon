// lib/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { parse, serialize } from 'cookie'

// Secrets (ensure these are set in your environment)
const JWT_SECRET = process.env.JWT_SECRET as string
const RESET_SECRET = process.env.RESET_TOKEN_SECRET as string
const COOKIE_NAME = 'CHURCH_TOKEN'

const COOKIE_OPTIONS = {
  httpOnly: true as const,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

// 1. Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// 2. JWT session tokens
export function signJwt(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJwt(token: string): { userId: string; role: string } {
  return jwt.verify(token, JWT_SECRET) as any
}

// 3. Session cookie helpers
export function setSessionCookie(
  res: NextApiResponse,
  token: string
): void {
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, token, {
      maxAge: 7 * 24 * 60 * 60,
      ...COOKIE_OPTIONS,
    })
  )
}

export function clearSessionCookie(res: NextApiResponse): void {
  res.setHeader(
    'Set-Cookie',
    serialize(COOKIE_NAME, '', { maxAge: -1, ...COOKIE_OPTIONS })
  )
}

export function getTokenFromReq(req: NextApiRequest): string | null {
  const header = req.headers.cookie
  if (!header) return null
  const parsed = parse(header)
  return parsed[COOKIE_NAME] || null
}

export function requireAuthApi(
  req: NextApiRequest,
  res: NextApiResponse
): { userId: string; role: string } {
  const token = getTokenFromReq(req)
  if (!token) {
    res.status(401).end('Not authenticated')
    throw new Error('Not authenticated')
  }
  try {
    return verifyJwt(token)
  } catch {
    res.status(401).end('Invalid token')
    throw new Error('Invalid token')
  }
}

// 4. Password reset & invite tokens
export function signResetToken(email: string): string {
  return jwt.sign({ email }, RESET_SECRET, { expiresIn: '1h' })
}

export function verifyResetToken(token: string): { email: string } {
  return jwt.verify(token, RESET_SECRET) as any
}
