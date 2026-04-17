import { Pool, PoolMember } from '../domain/entities/Pool';

export interface IPoolRepository {
  findById(id: number): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
  create(year: number, members: Omit<PoolMember, 'id' | 'poolId'>[]): Promise<Pool>;
}
