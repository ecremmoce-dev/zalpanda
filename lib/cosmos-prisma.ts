import { PrismaClient } from '../prisma/generated/cosmos-client'

declare global {
  var cosmosPrisma: PrismaClient | undefined
}

export const cosmosPrisma = global.cosmosPrisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.cosmosPrisma = cosmosPrisma
} 