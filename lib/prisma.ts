// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

/**
 * Ensure a single PrismaClient instance
 * across hot reloads in development.
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
}
