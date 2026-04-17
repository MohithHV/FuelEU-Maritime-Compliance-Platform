import { PrismaClient } from '@prisma/client';
import { IBankingRepository } from '../../../core/ports/IBankingRepository';
import { BankEntry } from '../../../core/domain/entities/BankEntry';

export class PrismaBankingRepository implements IBankingRepository {
  constructor(private prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    return await this.prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAvailableBalance(shipId: string): Promise<number> {
    const entries = await this.prisma.bankEntry.findMany({
      where: { shipId, isApplied: false },
    });

    return entries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
  }

  async create(entry: Omit<BankEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankEntry> {
    return await this.prisma.bankEntry.create({
      data: entry,
    });
  }

  async markAsApplied(id: number): Promise<BankEntry> {
    return await this.prisma.bankEntry.update({
      where: { id },
      data: { isApplied: true },
    });
  }

  async findUnapplied(shipId: string): Promise<BankEntry[]> {
    return await this.prisma.bankEntry.findMany({
      where: { shipId, isApplied: false },
      orderBy: { year: 'asc' },
    });
  }
}
