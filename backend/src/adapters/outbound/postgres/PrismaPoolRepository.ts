import { PrismaClient } from '@prisma/client';
import { IPoolRepository } from '../../../core/ports/IPoolRepository';
import { Pool, PoolMember } from '../../../core/domain/entities/Pool';

export class PrismaPoolRepository implements IPoolRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Pool | null> {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!pool) return null;

    return {
      ...pool,
      members: pool.members,
    };
  }

  async findByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: { members: true },
      orderBy: { createdAt: 'desc' },
    });

    return pools.map((pool) => ({
      ...pool,
      members: pool.members,
    }));
  }

  async create(year: number, members: Omit<PoolMember, 'id' | 'poolId'>[]): Promise<Pool> {
    const pool = await this.prisma.pool.create({
      data: {
        year,
        members: {
          create: members,
        },
      },
      include: {
        members: true,
      },
    });

    return {
      ...pool,
      members: pool.members,
    };
  }
}
