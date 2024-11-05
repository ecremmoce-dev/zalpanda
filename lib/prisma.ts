import { PrismaClient } from '@prisma/client'

if (!process.env.TOMS_DATABASE_URL) {
  throw new Error('TOMS_DATABASE_URL environment variable is not set')
}

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

process.on('beforeExit', async () => {
  await prisma.$disconnect()
}) 