import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'




const prisma = new PrismaClient()

async function main() {
  const email = 'pilar@mchurch.com'
  const plain = 'SuperPilar'
  const hash = await bcrypt.hash(plain, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash: hash },
    create: {
      name: 'One Pilar',            
      email,
      uniqueId: randomUUID(),       
      passwordHash: hash,
      role: 'ADMIN',
    },
  })

  console.log(`Seeded admin: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
