import { BankEntry } from '../domain/entities/BankEntry';

export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  findAvailableBalance(shipId: string): Promise<number>;
  create(entry: Omit<BankEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<BankEntry>;
  markAsApplied(id: number): Promise<BankEntry>;
  findUnapplied(shipId: string): Promise<BankEntry[]>;
}
