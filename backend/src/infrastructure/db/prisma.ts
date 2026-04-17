import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Singleton Prisma Client instance
let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return prisma;
};

export const disconnectPrisma = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
  }
};
