export interface Pool {
  id: number;
  poolId: string;
  poolName: string;
  year: number;
  memberShips: string[];
  totalSurplus: number;
  totalDeficit: number;
  netBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PoolMember {
  shipId: string;
  contribution: number;
  allocation: number;
  netEffect: number;
}

export interface CreatePoolRequest {
  poolName: string;
  year: number;
  memberShips: string[];
  notes?: string;
}

export interface PoolDetails extends Pool {
  members: PoolMember[];
  distributionStrategy: 'equal' | 'proportional' | 'custom';
}

export interface PoolFilters {
  year?: number;
  isActive?: boolean;
  shipId?: string;
}
